export type Estilo = "energetico" | "sofisticado" | "urgencia" | "emocional" | "humor";

interface ScriptParams {
  produto: string;
  beneficio: string;
  preco?: string;
  estilo: Estilo;
}

const TEMPLATES: Record<Estilo, (p: ScriptParams) => string[]> = {
  energetico: ({ produto, beneficio, preco }) => [
    `Olha só isso! ${produto}!`,
    `${beneficio}.`,
    preco ? `Por apenas ${preco}!` : "Preço imperdível!",
    "Não perde tempo. Garante o teu agora!",
  ],
  sofisticado: ({ produto, beneficio, preco }) => [
    `Apresentamos: ${produto}.`,
    `${beneficio}.`,
    preco ? `Investimento: ${preco}.` : "Qualidade premium.",
    "Para quem sabe o que quer.",
  ],
  urgencia: ({ produto, beneficio, preco }) => [
    `ATENÇÃO! ${produto} em promoção!`,
    `${beneficio}.`,
    preco ? `Só por ${preco} — mas é por tempo limitado!` : "Estoque limitadíssimo!",
    "Corre antes que acabe!",
  ],
  emocional: ({ produto, beneficio, preco }) => [
    `Imagina ter ${produto}...`,
    `${beneficio}.`,
    preco ? `Tudo isso por ${preco}.` : "Acessível para você.",
    "Você merece. Pede o teu hoje.",
  ],
  humor: ({ produto, beneficio, preco }) => [
    `Ei, espera! ${produto} chegou!`,
    `${beneficio}. Sério, isso existe!`,
    preco ? `E custa só ${preco}. Que absurdo, né?` : "E o preço vai te surpreender.",
    "Corre lá e se arrepende de não ter comprado antes!",
  ],
};

export function gerarScript(params: ScriptParams): string {
  const linhas = TEMPLATES[params.estilo](params);
  return linhas.join(" ");
}

export function gerarLinhas(params: ScriptParams): string[] {
  return TEMPLATES[params.estilo](params);
}
