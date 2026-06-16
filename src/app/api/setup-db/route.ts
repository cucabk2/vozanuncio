import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL ?? "UNDEFINED";
  // Only show non-secret part for debugging
  const safe = url.replace(/:([^@]+)@/, ":***@");

  try {
    const { Client } = await import("pg");
    const client = new Client({ connectionString: url });
    await client.connect();
    const r = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    const tables = (r.rows as Array<{ table_name: string }>).map((row) => row.table_name);

    if (!tables.includes("UserCredits")) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "UserCredits" (
          "email"     TEXT        PRIMARY KEY,
          "credits"   INTEGER     NOT NULL DEFAULT 30,
          "plan"      TEXT        NOT NULL DEFAULT 'free',
          "createdAt" TIMESTAMP   NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP   NOT NULL DEFAULT NOW()
        )
      `);
    }
    if (!tables.includes("Anuncio")) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Anuncio" (
          "id"        TEXT        PRIMARY KEY,
          "email"     TEXT        NOT NULL,
          "produto"   TEXT        NOT NULL,
          "script"    TEXT        NOT NULL,
          "estilo"    TEXT        NOT NULL,
          "createdAt" TIMESTAMP   NOT NULL DEFAULT NOW()
        )
      `);
    }

    const r2 = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    await client.end();

    return NextResponse.json({
      ok: true,
      url_safe: safe,
      tables: (r2.rows as Array<{ table_name: string }>).map((row) => row.table_name),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, url_safe: safe, error: String(e) }, { status: 500 });
  }
}
