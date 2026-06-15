import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { gerarScript, gerarLinhas, type Estilo } from "@/lib/script-generator";
import { generateVoice } from "@/lib/tts";
import { getCredits, deductCredit } from "@/lib/credits";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Login necessário" }, { status: 401 });
  }

  const email = session.user.email;

  let body: { produto: string; beneficio: string; preco?: string; estilo: Estilo; voz?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const { produto, beneficio, preco, estilo, voz } = body;

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
      { error: "Sem créditos. Compre um plano para continuar.", credits: 0 },
      { status: 402 }
    );
  }

  const script = gerarScript({ produto: produto.trim(), beneficio: beneficio.trim(), preco, estilo });
  const linhas = gerarLinhas({ produto: produto.trim(), beneficio: beneficio.trim(), preco, estilo });

  // Tentar gerar voz com ElevenLabs (silencioso se falhar)
  const audioBuffer = await generateVoice(script, voz ?? "feminina");

  let remaining: number;
  try {
    remaining = await deductCredit(email);
  } catch {
    remaining = credits - 1;
  }

  // Salvar no histórico
  try {
    await prisma.anuncio.create({
      data: { email, produto: produto.trim(), script, estilo },
    });
  } catch {
    // não bloqueia se falhar
  }

  if (audioBuffer) {
    // Retornar audio + metadados no header
    const res = new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "X-Credits-Remaining": String(remaining),
        "X-Script": encodeURIComponent(script),
        "X-Linhas": encodeURIComponent(JSON.stringify(linhas)),
        "Access-Control-Expose-Headers": "X-Credits-Remaining, X-Script, X-Linhas",
      },
    });
    return res;
  }

  // Fallback: retornar apenas script (sem áudio)
  return NextResponse.json(
    { script, linhas, credits: remaining, audioDisponivel: false },
    {
      status: 200,
      headers: { "X-Credits-Remaining": String(remaining) },
    }
  );
}
