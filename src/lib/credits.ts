import { prisma } from "./prisma";

export async function getCredits(email: string): Promise<number> {
  const row = await prisma.userCredits.findUnique({ where: { email } });
  if (!row) {
    const created = await prisma.userCredits.create({ data: { email } });
    return created.credits;
  }
  return row.credits;
}

export async function deductCredit(email: string): Promise<number> {
  const row = await prisma.userCredits.upsert({
    where: { email },
    create: { email, credits: 2 },
    update: { credits: { decrement: 1 } },
  });
  return row.credits;
}

export async function addCredits(email: string, amount: number): Promise<number> {
  const row = await prisma.userCredits.upsert({
    where: { email },
    create: { email, credits: 3 + amount },
    update: { credits: { increment: amount }, plan: "paid" },
  });
  return row.credits;
}

export async function setPlan(email: string, plan: string): Promise<void> {
  await prisma.userCredits.upsert({
    where: { email },
    create: { email, plan },
    update: { plan },
  });
}
