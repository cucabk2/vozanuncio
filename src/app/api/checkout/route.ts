import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, PLANOS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Login necessário" }, { status: 401 });
  }

  const { planoId } = await req.json();
  const plano = PLANOS.find((p) => p.id === planoId);
  if (!plano) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vozanuncio.vercel.app";

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email,
    metadata: { email: session.user.email, planoId, credits: String(plano.credits) },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "brl",
          unit_amount: plano.preco === "R$19" ? 1900 : plano.preco === "R$47" ? 4700 : 9700,
          product_data: {
            name: `VozAnúncio ${plano.nome}`,
            description: plano.descricao,
          },
        },
      },
    ],
    success_url: `${appUrl}/dashboard?sucesso=1`,
    cancel_url: `${appUrl}/#precos`,
  });

  return NextResponse.json({ url: checkout.url });
}
