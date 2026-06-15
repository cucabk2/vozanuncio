import Anthropic from "@anthropic-ai/sdk";
import { gerarScript, gerarLinhas, type Estilo } from "./script-generator";

const ESTILO_PROMPTS: Record<string, string> = {
  energetico:
    "enérgico, impactante, com senso de urgência positiva. Começa com chamada de atenção forte. Ritmo rápido.",
  urgencia:
    "urgente, cria escassez real. Estoque limitado, tempo acabando, oportunidade única. Faz agir agora.",
  emocional:
    "emocional e aspiracional. Faz o cliente imaginar como vai se sentir ao ter esse produto. Conecta com desejo.",
  sofisticado:
    "sofisticado, premium, exclusivo. Tom elegante e confiante. Para quem valoriza qualidade e status.",
  humor:
    "divertido, leve, inesperado. Causa sorriso ou surpresa. Memorável. Sem forçar.",
};

export async function gerarScriptIA(params: {
  produto: string;
  beneficio: string;
  preco?: string;
  estilo: string;
}): Promise<{ script: string; linhas: string[] }> {
  const { produto, beneficio, preco, estilo } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    // Fallback to templates if key not configured
    const linhas = gerarLinhas({ produto, beneficio, preco, estilo: estilo as Estilo });
    const script = gerarScript({ produto, beneficio, preco, estilo: estilo as Estilo });
    return { script, linhas };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const estiloDesc = ESTILO_PROMPTS[estilo] || ESTILO_PROMPTS.energetico;

  const prompt = `Você é o melhor copywriter do Brasil para anúncios em vídeo curto (TikTok, Reels, Facebook Ads).

Crie um roteiro de locução de anúncio exclusivo para o produto abaixo.
Tom: ${estiloDesc}

PRODUTO: ${produto}
BENEFÍCIO PRINCIPAL: ${beneficio}${preco ? `\nPREÇO: ${preco}` : ""}

REGRAS OBRIGATÓRIAS:
- Exatamente 4 frases
- Cada frase: máximo 10 palavras
- Total: máximo 32 palavras
- Português brasileiro natural e conversacional
- Última frase = chamada para ação forte e clara
- SEM hashtags, emojis, números de lista ou símbolos especiais
- Cada frase deve ser autocontida e impactante isoladamente
- O roteiro deve soar natural quando lido em voz alta

Responda APENAS com JSON válido, sem explicações:
{"linhas":["frase 1","frase 2","frase 3","frase 4"]}`;

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (msg.content[0] as { type: string; text: string }).text.trim();
    const m = text.match(/\{[\s\S]*?\}/);
    if (!m) throw new Error("Formato inválido");

    const parsed = JSON.parse(m[0]) as { linhas: string[] };
    if (!Array.isArray(parsed.linhas) || parsed.linhas.length !== 4) {
      throw new Error("Resposta com formato inesperado");
    }

    const linhas = parsed.linhas.map((l) => l.trim());
    return { linhas, script: linhas.join(" ") };
  } catch {
    // Fallback to templates on any AI error
    const linhas = gerarLinhas({ produto, beneficio, preco, estilo: estilo as Estilo });
    const script = gerarScript({ produto, beneficio, preco, estilo: estilo as Estilo });
    return { script, linhas };
  }
}
