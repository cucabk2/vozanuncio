import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { gerarScriptIA } from "@/lib/ai-script-generator";
import { type Estilo } from "@/lib/script-generator";
import { generateVoice } from "@/lib/tts";
import { generateProductImage } from "@/lib/image-generator";
import { getCredits, deductCredit } from "@/lib/credits";
import pg from "pg";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Login necessário" }, { status: 401 });
  }

  const email = session.user.email;

  let body: {
    produto: string;
    beneficio: string;
    preco?: string;
    estilo: Estilo;
    voz?: string;
    imagemUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const { produto, beneficio, preco, estilo, voz, imagemUrl: imagemUrlInput } = body;

  if (!produto || typeof produto !== "string" || produto.trim().length < 2) {
    return NextResponse.json({ error: "Nome do produto obrigatório (mín. 2 caracteres)" }, { status: 400 });
  }
  if (!beneficio || typeof beneficio !== "string" || beneficio.trim().length < 5) {
    return NextResponse.json({ error: "Benefício obrigatório (mín. 5 caracteres)" }, { status: 400 });
  }
  const estilosValidos: Estilo[] = ["energetico", "sofisticado", "urgencia", "emocional", "humor"];
  if (!estilosValidos.includes(estilo)) {
    return NextResponse.json({ error: "Estilo inválido" }, { status: 400 });
  }

  let credits: number;
  try {
    credits = await getCredits(email);
  } catch {
    return NextResponse.json({ error: "Erro ao verificar créditos" }, { status: 500 });
  }

  if (credits < 1) {
    return NextResponse.json(
      { error: "Sem tokens. Compre um plano para continuar.", credits: 0 },
      { status: 402 }
    );
  }

  // Gerar script com IA (Claude)
  let script: string, linhas: string[];
  try {
    ({ script, linhas } = await gerarScriptIA({
      produto: produto.trim(),
      beneficio: beneficio.trim(),
      preco,
      estilo,
    }));
  } catch (err) {
    console.error("gerarScriptIA error:", err);
    return NextResponse.json({ error: "Erro ao gerar script" }, { status: 500 });
  }

  // Gerar imagem e voz em paralelo
  const [imagemDataUrl, audioBuffer] = await Promise.all([
    imagemUrlInput
      ? Promise.resolve(null)
      : generateProductImage(produto.trim(), beneficio.trim(), estilo).catch((err) => {
          console.error("generateProductImage error:", err);
          return null;
        }),
    generateVoice(script, voz ?? "feminina").catch((err) => {
      console.error("generateVoice error:", err);
      return null;
    }),
  ]);

  const imagemFinal = imagemUrlInput ?? imagemDataUrl ?? null;

  let remaining: number;
  try {
    remaining = await deductCredit(email);
  } catch {
    remaining = credits - 1;
  }

  // Salvar no histórico
  try {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(
      'INSERT INTO "Anuncio" (id, email, produto, script, estilo, "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
      [crypto.randomUUID(), email, produto.trim(), script, estilo]
    );
    await client.end().catch(() => {});
  } catch {
    // não bloqueia se falhar
  }

  // Converter áudio para base64 se disponível
  let audioBase64: string | null = null;
  if (audioBuffer) {
    const bytes = new Uint8Array(audioBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    audioBase64 = btoa(binary);
  }

  return NextResponse.json({
    script,
    linhas,
    credits: remaining,
    audioBase64,
    imagemDataUrl: imagemFinal,
  });
}
