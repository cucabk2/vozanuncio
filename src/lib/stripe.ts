import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export const PLANOS = [
  {
    id: "starter",
    nome: "Starter",
    preco: "R$19",
    credits: 10,
    priceId: "price_starter",
    descricao: "10 vídeos de anúncio",
  },
  {
    id: "popular",
    nome: "Popular",
    preco: "R$47",
    credits: 30,
    priceId: "price_popular",
    descricao: "30 vídeos de anúncio",
    destaque: true,
  },
  {
    id: "pro",
    nome: "Profissional",
    preco: "R$97",
    credits: 100,
    priceId: "price_pro",
    descricao: "100 vídeos de anúncio",
  },
];
