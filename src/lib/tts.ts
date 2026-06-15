const VOICE_IDS: Record<string, string> = {
  feminina: "EXAVITQu4vr4xnSDxMaL",
  masculino: "29vD33N1osed6aR8gs3S",
  jovem: "21m00Tcm4TlvDq8ikWAM",
  formal: "ErXwobaYiN019PkySvjV",
};

export async function generateVoice(script: string, voz = "feminina"): Promise<ArrayBuffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const voiceId = VOICE_IDS[voz] ?? VOICE_IDS.feminina;

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`ElevenLabs ${res.status}:`, err);
    return null;
  }

  return res.arrayBuffer();
}
