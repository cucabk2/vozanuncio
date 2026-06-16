import pg from "pg";

const FREE_TOKENS = 30;

function getClient() {
  return new pg.Client({ connectionString: process.env.DATABASE_URL });
}

async function withClient<T>(fn: (client: pg.Client) => Promise<T>): Promise<T> {
  const client = getClient();
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end().catch(() => {});
  }
}

export async function getCredits(email: string): Promise<number> {
  return withClient(async (client) => {
    const r = await client.query<{ credits: number }>(
      'SELECT credits FROM "UserCredits" WHERE email = $1',
      [email]
    );
    if (r.rowCount === 0) {
      const ins = await client.query<{ credits: number }>(
        'INSERT INTO "UserCredits" (email, credits, plan, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING credits',
        [email, FREE_TOKENS, "free"]
      );
      return ins.rows[0].credits;
    }
    return r.rows[0].credits;
  });
}

export async function deductCredit(email: string): Promise<number> {
  return withClient(async (client) => {
    const r = await client.query<{ credits: number }>(
      'UPDATE "UserCredits" SET credits = GREATEST(0, credits - 1), "updatedAt" = NOW() WHERE email = $1 RETURNING credits',
      [email]
    );
    if (r.rowCount === 0) {
      const ins = await client.query<{ credits: number }>(
        'INSERT INTO "UserCredits" (email, credits, plan, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING credits',
        [email, FREE_TOKENS - 1, "free"]
      );
      return ins.rows[0].credits;
    }
    return r.rows[0].credits;
  });
}

export async function addCredits(email: string, amount: number): Promise<number> {
  return withClient(async (client) => {
    const r = await client.query<{ credits: number }>(
      'INSERT INTO "UserCredits" (email, credits, plan, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT (email) DO UPDATE SET credits = "UserCredits".credits + $2, plan = $3, "updatedAt" = NOW() RETURNING credits',
      [email, amount, "paid"]
    );
    return r.rows[0].credits;
  });
}

export async function setPlan(email: string, plan: string): Promise<void> {
  await withClient(async (client) => {
    await client.query(
      'INSERT INTO "UserCredits" (email, credits, plan, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT (email) DO UPDATE SET plan = $3, "updatedAt" = NOW()',
      [email, FREE_TOKENS, plan]
    );
  });
}
