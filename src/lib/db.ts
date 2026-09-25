"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { DEFAULT_SOLAR_CONFIG } from "./solar-config";

function getDb() {
  const url = process.env["DATABASE_URL"];
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function initDb() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      id INTEGER PRIMARY KEY DEFAULT 1,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS otp_sessions (
      id TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      purpose TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN DEFAULT FALSE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS solar_config (
      id INTEGER PRIMARY KEY DEFAULT 1,
      config JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Seed admin credentials if not present
  const creds = await sql`SELECT id FROM admin_credentials WHERE id = 1`;
  if (creds.length === 0) {
    const username = process.env["ADMIN_USERNAME"] ?? "celsAdmin";
    const password = process.env["ADMIN_PASSWORD"] ?? "celsPassword";
    const hash = await bcrypt.hash(password, 12);
    await sql`
      INSERT INTO admin_credentials (id, username, password_hash)
      VALUES (1, ${username}, ${hash})
    `;
  }

  // Seed solar config if not present
  const cfg = await sql`SELECT id FROM solar_config WHERE id = 1`;
  if (cfg.length === 0) {
    await sql`
      INSERT INTO solar_config (id, config)
      VALUES (1, ${JSON.stringify(DEFAULT_SOLAR_CONFIG)})
    `;
  }
}

export { getDb };
