-- Execute no painel Neon (SQL Editor)
-- VozAnuncio - tabelas necessarias

CREATE TABLE IF NOT EXISTS "UserCredits" (
  "email"     TEXT        PRIMARY KEY,
  "credits"   INTEGER     NOT NULL DEFAULT 3,
  "plan"      TEXT        NOT NULL DEFAULT 'free',
  "createdAt" TIMESTAMP   NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Anuncio" (
  "id"        TEXT        PRIMARY KEY,
  "email"     TEXT        NOT NULL,
  "produto"   TEXT        NOT NULL,
  "script"    TEXT        NOT NULL,
  "estilo"    TEXT        NOT NULL,
  "createdAt" TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- Confirmar criacao
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('UserCredits', 'Anuncio');
