import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test connection and create tables if needed
    const result = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    ` as Array<{ table_name: string }>;

    const tables = result.map((r) => r.table_name);

    if (!tables.includes("UserCredits")) {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "UserCredits" (
          "email"     TEXT        PRIMARY KEY,
          "credits"   INTEGER     NOT NULL DEFAULT 30,
          "plan"      TEXT        NOT NULL DEFAULT 'free',
          "createdAt" TIMESTAMP   NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP   NOT NULL DEFAULT NOW()
        )
      `;
    }

    if (!tables.includes("Anuncio")) {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Anuncio" (
          "id"        TEXT        PRIMARY KEY,
          "email"     TEXT        NOT NULL,
          "produto"   TEXT        NOT NULL,
          "script"    TEXT        NOT NULL,
          "estilo"    TEXT        NOT NULL,
          "createdAt" TIMESTAMP   NOT NULL DEFAULT NOW()
        )
      `;
    }

    const tablesAfter = (await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    ` as Array<{ table_name: string }>).map((r) => r.table_name);

    return NextResponse.json({ ok: true, tables: tablesAfter });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
