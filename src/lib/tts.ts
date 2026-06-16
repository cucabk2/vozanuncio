import OpenAI from "openai";

const VOICE_MAP: Record<string, "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"> = {
  feminina: "nova",     // voz jovial, energética, feminina
  jovem: "shimmer",    // expressiva e agradável
  masculino: "onyx",   // grave, autoridade
  formal: "echo",      // neutro, profissional
};

export async function generateVoice(script: string, voz = "feminina"): Promise<ArrayBuffer | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const client = new OpenAI({ apiKey });
  const voice = VOICE_MAP[voz] ?? "nova";

  try {
    const mp3 = await client.audio.speech.create({
      model: "tts-1-hd",
      voice,
      input: script,
      speed: 1.15,
    });
    return mp3.arrayBuffer();
  } catch (err) {
    console.error("OpenAI TTS error:", err);
    return null;
  }
}
