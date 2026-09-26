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

// ─── visitor tracking (public) ────────────────────────────────────────────────

export const recordVisit = createServerFn()
  .validator(z.object({ visitId: z.string(), sessionId: z.string(), device: z.string(), referrer: z.string() }))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      await initDb();
      const sql = getDb();
      await sql`
        INSERT INTO page_visits (id, session_id, device, referrer)
        VALUES (${data.visitId}, ${data.sessionId}, ${data.device}, ${data.referrer})
        ON CONFLICT (id) DO NOTHING
      `;
    } catch { /* non-fatal */ }
    return { ok: true };
  });

export const updateVisitDuration = createServerFn()
  .validator(z.object({ visitId: z.string(), durationSeconds: z.number() }))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      const sql = getDb();
      await sql`
        UPDATE page_visits SET duration_seconds = ${data.durationSeconds}
        WHERE id = ${data.visitId}
      `;
    } catch { /* non-fatal */ }
    return { ok: true };
  });

export const recordQuoteEvent = createServerFn()
  .validator(z.object({
    sessionId: z.string(),
    eventType: z.enum(["form_opened", "whatsapp_sent"]),
    packageSelected: z.string(),
    hasCalcData: z.boolean(),
  }))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      const sql = getDb();
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO quote_events (id, session_id, event_type, package_selected, has_calc_data)
        VALUES (${id}, ${data.sessionId}, ${data.eventType}, ${data.packageSelected}, ${data.hasCalcData})
      `;
    } catch { /* non-fatal */ }
    return { ok: true };
  });

// ─── activity data (admin only) ──────────────────────────────────────────────

export type ActivityData = {
  totalVisitors: number;
  todayVisitors: number;
  avgDurationSeconds: number;
  formOpens: number;
  whatsappSent: number;
  recentVisits: Array<{ arrivedAt: string; device: string; durationSeconds: number }>;
  recentQuoteEvents: Array<{ createdAt: string; eventType: string; packageSelected: string; hasCalcData: boolean }>;
  visitsByDay: Array<{ date: string; visitors: number }>;
  eventsByDay: Array<{ date: string; formOpens: number; whatsappSent: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  durationBuckets: Array<{ label: string; count: number }>;
};

export const getActivityData = createServerFn()
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }): Promise<ActivityData> => {
    await requireSession(data.token);
    const sql = getDb();

    const [
      totalsRow, todayRow, avgRow, formRow, waRow,
      recentVisits, recentQuotes,
      visitsByDayRaw, formsByDayRaw, waByDayRaw,
      deviceRaw, durationRaw,
    ] = await Promise.all([
      sql`SELECT COUNT(DISTINCT session_id) AS total FROM page_visits`,
      sql`SELECT COUNT(DISTINCT session_id) AS today FROM page_visits WHERE arrived_at >= NOW() - INTERVAL '24 hours'`,
      sql`SELECT COALESCE(AVG(duration_seconds), 0) AS avg FROM page_visits WHERE duration_seconds > 0`,
      sql`SELECT COUNT(*) AS cnt FROM quote_events WHERE event_type = 'form_opened'`,
      sql`SELECT COUNT(*) AS cnt FROM quote_events WHERE event_type = 'whatsapp_sent'`,
      sql`SELECT device, arrived_at, duration_seconds FROM page_visits ORDER BY arrived_at DESC LIMIT 20`,
      sql`SELECT event_type, package_selected, has_calc_data, created_at FROM quote_events ORDER BY created_at DESC LIMIT 20`,
      sql`SELECT TO_CHAR(arrived_at AT TIME ZONE 'UTC', 'Mon DD') AS date, COUNT(DISTINCT session_id) AS visitors
          FROM page_visits WHERE arrived_at >= NOW() - INTERVAL '14 days'
          GROUP BY DATE_TRUNC('day', arrived_at), TO_CHAR(arrived_at AT TIME ZONE 'UTC', 'Mon DD')
          ORDER BY DATE_TRUNC('day', arrived_at)`,
      sql`SELECT TO_CHAR(created_at AT TIME ZONE 'UTC', 'Mon DD') AS date, COUNT(*) AS cnt
          FROM quote_events WHERE event_type = 'form_opened' AND created_at >= NOW() - INTERVAL '14 days'
          GROUP BY DATE_TRUNC('day', created_at), TO_CHAR(created_at AT TIME ZONE 'UTC', 'Mon DD')
          ORDER BY DATE_TRUNC('day', created_at)`,
      sql`SELECT TO_CHAR(created_at AT TIME ZONE 'UTC', 'Mon DD') AS date, COUNT(*) AS cnt
          FROM quote_events WHERE event_type = 'whatsapp_sent' AND created_at >= NOW() - INTERVAL '14 days'
          GROUP BY DATE_TRUNC('day', created_at), TO_CHAR(created_at AT TIME ZONE 'UTC', 'Mon DD')
          ORDER BY DATE_TRUNC('day', created_at)`,
      sql`SELECT device, COUNT(*) AS cnt FROM page_visits GROUP BY device`,
      sql`SELECT
            CASE
              WHEN duration_seconds < 60 THEN '<1 min'
              WHEN duration_seconds < 180 THEN '1–3 min'
              WHEN duration_seconds < 300 THEN '3–5 min'
              ELSE '5+ min'
            END AS bucket,
            COUNT(*) AS cnt
          FROM page_visits WHERE duration_seconds > 0
          GROUP BY bucket`,
    ]);

    // Merge visits/events by day into a single timeline
    const dayMap = new Map<string, { visitors: number; formOpens: number; whatsappSent: number }>();
    for (const r of visitsByDayRaw as Array<Record<string, unknown>>) {
      const d = String(r['date']);
      dayMap.set(d, { visitors: Number(r['visitors']), formOpens: 0, whatsappSent: 0 });
    }
    for (const r of formsByDayRaw as Array<Record<string, unknown>>) {
      const d = String(r['date']);
      const existing = dayMap.get(d) ?? { visitors: 0, formOpens: 0, whatsappSent: 0 };
      dayMap.set(d, { ...existing, formOpens: Number(r['cnt']) });
    }
    for (const r of waByDayRaw as Array<Record<string, unknown>>) {
      const d = String(r['date']);
      const existing = dayMap.get(d) ?? { visitors: 0, formOpens: 0, whatsappSent: 0 };
      dayMap.set(d, { ...existing, whatsappSent: Number(r['cnt']) });
    }

    const bucketOrder = ['<1 min', '1–3 min', '3–5 min', '5+ min'];

    return {
      totalVisitors: Number((totalsRow[0] as Record<string, unknown>)?.['total'] ?? 0),
      todayVisitors: Number((todayRow[0] as Record<string, unknown>)?.['today'] ?? 0),
      avgDurationSeconds: Math.round(Number((avgRow[0] as Record<string, unknown>)?.['avg'] ?? 0)),
      formOpens: Number((formRow[0] as Record<string, unknown>)?.['cnt'] ?? 0),
      whatsappSent: Number((waRow[0] as Record<string, unknown>)?.['cnt'] ?? 0),
      recentVisits: (recentVisits as Array<Record<string, unknown>>).map((v) => ({
        arrivedAt: String(v['arrived_at']),
        device: String(v['device']),
        durationSeconds: Number(v['duration_seconds']),
      })),
      recentQuoteEvents: (recentQuotes as Array<Record<string, unknown>>).map((q) => ({
        createdAt: String(q['created_at']),
        eventType: String(q['event_type']),
        packageSelected: String(q['package_selected'] ?? "—"),
        hasCalcData: Boolean(q['has_calc_data']),
      })),
      visitsByDay: Array.from(dayMap.entries()).map(([date, d]) => ({ date, visitors: d.visitors })),
      eventsByDay: Array.from(dayMap.entries()).map(([date, d]) => ({ date, formOpens: d.formOpens, whatsappSent: d.whatsappSent })),
      deviceBreakdown: (deviceRaw as Array<Record<string, unknown>>).map((r) => ({
        device: String(r['device']),
        count: Number(r['cnt']),
      })),
      durationBuckets: bucketOrder.map((label) => {
        const row = (durationRaw as Array<Record<string, unknown>>).find((r) => r['bucket'] === label);
        return { label, count: Number(row?.['cnt'] ?? 0) };
      }),
    };
  });
