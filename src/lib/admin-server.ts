"use server";

import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getDb, initDb } from "./db";
import { sendOtpEmail } from "./email";
import { DEFAULT_SOLAR_CONFIG, type SolarConfig } from "./solar-config";

// ─── helpers ────────────────────────────────────────────────────────────────

function randomOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function requireSession(token: string) {
  const sql = getDb();
  const rows = await sql`
    SELECT token FROM admin_sessions
    WHERE token = ${token} AND expires_at > NOW()
  `;
  if (rows.length === 0) throw new Error("Invalid or expired session");
}

// ─── public: fetch solar config (used by calculator) ────────────────────────

export const getSolarConfig = createServerFn().handler(
  async (): Promise<SolarConfig> => {
    try {
      await initDb();
      const sql = getDb();
      const rows = await sql`SELECT config FROM solar_config WHERE id = 1`;
      return (rows[0]?.['config'] as SolarConfig) ?? DEFAULT_SOLAR_CONFIG;
    } catch {
      return DEFAULT_SOLAR_CONFIG;
    }
  }
);

// ─── admin login: step 1 ─────────────────────────────────────────────────────

export const adminLogin = createServerFn()
  .validator(z.object({ username: z.string(), password: z.string() }))
  .handler(async ({ data }): Promise<{ sessionId: string }> => {
    await initDb();
    const sql = getDb();
    const rows = await sql`
      SELECT username, password_hash FROM admin_credentials WHERE id = 1
    `;
    const cred = rows[0];
    if (!cred) throw new Error("No admin configured");

    const usernameMatch = data.username === (cred['username'] as string);
    const passwordMatch = await bcrypt.compare(data.password, cred['password_hash'] as string);
    if (!usernameMatch || !passwordMatch) throw new Error("Invalid credentials");

    const otp = randomOtp();
    const sessionId = randomToken();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await sql`
      INSERT INTO otp_sessions (id, otp, purpose, expires_at)
      VALUES (${sessionId}, ${otp}, ${"login"}, ${expires})
    `;

    await sendOtpEmail(otp);
    return { sessionId };
  });

// ─── admin login: step 2 (verify OTP) ────────────────────────────────────────

export const adminVerifyOtp = createServerFn()
  .validator(z.object({ sessionId: z.string(), otp: z.string() }))
  .handler(async ({ data }): Promise<{ token: string }> => {
    const sql = getDb();
    const rows = await sql`
      SELECT otp, used FROM otp_sessions
      WHERE id = ${data.sessionId}
        AND purpose = ${"login"}
        AND expires_at > NOW()
    `;
    const session = rows[0];
    if (!session) throw new Error("OTP expired or not found");
    if (session['used']) throw new Error("OTP already used");
    if (session['otp'] !== data.otp) throw new Error("Incorrect OTP");

    await sql`UPDATE otp_sessions SET used = TRUE WHERE id = ${data.sessionId}`;

    const token = randomToken();
    const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    await sql`INSERT INTO admin_sessions (token, expires_at) VALUES (${token}, ${expires})`;

    return { token };
  });

// ─── validate session ─────────────────────────────────────────────────────────

export const validateSession = createServerFn()
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }): Promise<{ valid: boolean }> => {
    try {
      const sql = getDb();
      const rows = await sql`
        SELECT token FROM admin_sessions
        WHERE token = ${data.token} AND expires_at > NOW()
      `;
      return { valid: rows.length > 0 };
    } catch {
      return { valid: false };
    }
  });

// ─── get config (auth required) ──────────────────────────────────────────────

export const getAdminSolarConfig = createServerFn()
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }): Promise<SolarConfig> => {
    await requireSession(data.token);
    const sql = getDb();
    const rows = await sql`SELECT config FROM solar_config WHERE id = 1`;
    return (rows[0]?.['config'] as SolarConfig) ?? DEFAULT_SOLAR_CONFIG;
  });

// ─── update config (auth required) ───────────────────────────────────────────

export const updateSolarConfig = createServerFn()
  .validator(z.object({ token: z.string(), config: z.any() }))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    await requireSession(data.token);
    const sql = getDb();
    await sql`
      UPDATE solar_config SET config = ${JSON.stringify(data.config)}, updated_at = NOW()
      WHERE id = 1
    `;
    return { ok: true };
  });

// ─── request OTP for credential change ───────────────────────────────────────

export const requestCredentialOtp = createServerFn()
  .validator(z.object({ token: z.string(), purpose: z.enum(["update_username", "update_password"]) }))
  .handler(async ({ data }): Promise<{ sessionId: string }> => {
    await requireSession(data.token);
    const otp = randomOtp();
    const sessionId = randomToken();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const sql = getDb();
    await sql`
      INSERT INTO otp_sessions (id, otp, purpose, expires_at)
      VALUES (${sessionId}, ${otp}, ${data.purpose}, ${expires})
    `;
    await sendOtpEmail(otp);
    return { sessionId };
  });

// ─── update credentials (auth + OTP required) ────────────────────────────────

export const updateAdminCredentials = createServerFn()
  .validator(
    z.object({
      token: z.string(),
      sessionId: z.string(),
      otp: z.string(),
      field: z.enum(["username", "password"]),
      value: z.string().min(4),
    })
  )
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    await requireSession(data.token);
    const sql = getDb();
    const purpose = data.field === "username" ? "update_username" : "update_password";
    const rows = await sql`
      SELECT otp, used FROM otp_sessions
      WHERE id = ${data.sessionId}
        AND purpose = ${purpose}
        AND expires_at > NOW()
    `;
    const session = rows[0];
    if (!session) throw new Error("OTP expired or not found");
    if (session['used']) throw new Error("OTP already used");
    if (session['otp'] !== data.otp) throw new Error("Incorrect OTP");

    await sql`UPDATE otp_sessions SET used = TRUE WHERE id = ${data.sessionId}`;

    if (data.field === "username") {
      await sql`UPDATE admin_credentials SET username = ${data.value}, updated_at = NOW() WHERE id = 1`;
    } else {
      const hash = await bcrypt.hash(data.value, 12);
      await sql`UPDATE admin_credentials SET password_hash = ${hash}, updated_at = NOW() WHERE id = 1`;
    }

    return { ok: true };
  });
