import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export const PLANOS = [
  {
    id: "starter",
    nome: "Starter",
    preco: "R$19",
    credits: 30,
    priceId: "price_starter",
    descricao: "30 tokens de anúncio",
  },
  {
    id: "popular",
    nome: "Popular",
    preco: "R$47",
    credits: 300,
    priceId: "price_popular",
    descricao: "300 tokens de anúncio",
    destaque: true,
  },
  {
    id: "pro",
    nome: "Profissional",
    preco: "R$97",
    credits: 1000,
    priceId: "price_pro",
    descricao: "1000 tokens de anúncio",
  },
];
