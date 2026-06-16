import OpenAI from "openai";

const STYLE_PROMPT: Record<string, string> = {
  energetico: "dynamic action shot, vibrant orange and white background, energetic product display",
  urgencia: "bold dramatic lighting, red and dark background, urgent powerful product display",
  emocional: "warm lifestyle photography, soft golden light, emotional connection, beautiful product",
  sofisticado: "luxury minimalist product photography, white marble background, premium elegant display",
  humor: "fun colorful pop art style, playful bright colors, cheerful product display",
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

  const prompt = `Professional commercial advertisement: ${produto}. ${beneficio}. Style: ${styleDesc}. Clean composition, suitable for social media ads, photorealistic product photography. NO text overlays, NO watermarks.`;

  try {
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
    } as Parameters<typeof client.images.generate>[0]);

    const b64 = (response.data?.[0] as { b64_json?: string })?.b64_json;
    if (!b64) return null;
    return `data:image/png;base64,${b64}`;
  } catch (err) {
    console.error("Image generation error:", err);
    return null;
  }
}
