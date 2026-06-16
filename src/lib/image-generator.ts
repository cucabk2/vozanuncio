import OpenAI from "openai";

const STYLE_PROMPT: Record<string, string> = {
  energetico: "dynamic action shot, vibrant orange and white colors, energetic atmosphere",
  urgencia: "bold dramatic lighting, red accents, sense of urgency",
  emocional: "warm emotional lifestyle photography, soft golden light",
  sofisticado: "luxury minimalist product photography, black and white marble, premium",
  humor: "fun colorful pop art style, playful bright colors",
};

export async function generateProductImage(
  produto: string,
  beneficio: string,
  estilo: string
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const client = new OpenAI({ apiKey });
  const styleDesc = STYLE_PROMPT[estilo] ?? STYLE_PROMPT.energetico;

  const prompt = `Professional commercial advertisement product photo: ${produto}. ${beneficio}. Visual style: ${styleDesc}. Ultra-high quality product photography, clean composition, suitable for social media ads, photorealistic. NO text, NO watermarks, NO logos.`;

  try {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0]?.url ?? null;
  } catch (err) {
    console.error("DALL-E error:", err);
    return null;
  }
}
