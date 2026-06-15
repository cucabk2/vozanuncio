import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "VozAnúncio — Anúncios com IA em 2 minutos",
  description: "Crie anúncios profissionais com voz IA para TikTok, Instagram e Facebook Ads. Script + voz + animação gerados automaticamente.",
  openGraph: {
    title: "VozAnúncio — Anúncios com IA em 2 minutos",
    description: "Descreve o produto, escolhe o estilo e a IA cria o script + voz profissional automaticamente. 30 tokens grátis.",
    type: "website",
    locale: "pt_BR",
    siteName: "VozAnúncio",
  },
  twitter: {
    card: "summary_large_image",
    title: "VozAnúncio — Anúncios com IA em 2 minutos",
    description: "Descreve o produto, escolhe o estilo e a IA cria o script + voz profissional automaticamente. 30 tokens grátis.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
