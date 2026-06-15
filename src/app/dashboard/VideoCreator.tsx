"use client";
import { useState, useRef, useCallback } from "react";
import { Loader2, Play, Pause, Download, Sparkles, RefreshCw } from "lucide-react";

type Estilo = "energetico" | "sofisticado" | "urgencia" | "emocional" | "humor";

const ESTILOS: { id: Estilo; label: string; emoji: string; desc: string }[] = [
  { id: "energetico", label: "Energético", emoji: "⚡", desc: "Impacto e ação" },
  { id: "urgencia", label: "Urgência", emoji: "🔥", desc: "Escassez e pressa" },
  { id: "emocional", label: "Emocional", emoji: "💛", desc: "Conexão e desejo" },
  { id: "sofisticado", label: "Sofisticado", emoji: "💎", desc: "Premium e elegante" },
  { id: "humor", label: "Humor", emoji: "😄", desc: "Divertido e viral" },
];

const VOZES = [
  { id: "feminina", label: "Feminina" },
  { id: "masculino", label: "Masculino" },
  { id: "jovem", label: "Jovem" },
  { id: "formal", label: "Formal" },
];

interface Props {
  initialCredits: number;
}

export default function VideoCreator({ initialCredits }: Props) {
  const [credits, setCredits] = useState(initialCredits);
  const [form, setForm] = useState({
    produto: "",
    beneficio: "",
    preco: "",
    estilo: "energetico" as Estilo,
    voz: "feminina",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<{
    script: string;
    linhas: string[];
    audioUrl: string | null;
    audioDisponivel: boolean;
  } | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animating, setAnimating] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const [videoBlob, setVideoBlob] = useState<string | null>(null);

  function playBrowserTTS(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    u.rate = 0.9;
    u.onend = () => setPlaying(false);
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }

  function togglePlay() {
    if (resultado?.audioUrl && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
      return;
    }
    if (playing) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
    } else {
      playBrowserTTS(resultado?.script ?? "");
    }
  }

  // Animação do anúncio no canvas
  const animateCanvas = useCallback((linhas: string[], audioEl?: HTMLAudioElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setAnimating(true);
    const totalDuration = 6000;
    const start = Date.now();
    const linhaInterval = totalDuration / linhas.length;

    function draw() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / totalDuration, 1);
      const linhaIdx = Math.min(Math.floor(elapsed / linhaInterval), linhas.length - 1);

      // Background gradient
      const grad = ctx!.createLinearGradient(0, 0, canvas!.width, canvas!.height);
      grad.addColorStop(0, "#1a0533");
      grad.addColorStop(1, "#0d1a3a");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Overlay glow
      const cx = canvas!.width / 2;
      const cy = canvas!.height / 2;
      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 200);
      glow.addColorStop(0, "rgba(249,115,22,0.15)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Logo text
      ctx!.font = "bold 16px sans-serif";
      ctx!.fillStyle = "rgba(255,255,255,0.4)";
      ctx!.textAlign = "center";
      ctx!.fillText("VozAnúncio", canvas!.width / 2, 28);

      // Linha atual com fade
      const lineProgress = (elapsed % linhaInterval) / linhaInterval;
      const alpha = lineProgress < 0.15 ? lineProgress / 0.15 : lineProgress > 0.85 ? (1 - lineProgress) / 0.15 : 1;

      ctx!.globalAlpha = alpha;
      ctx!.font = "bold 26px sans-serif";
      ctx!.fillStyle = "#ffffff";
      ctx!.textAlign = "center";

      const linha = linhas[linhaIdx] ?? "";
      const words = linha.split(" ");
      let line = "";
      const lines: string[] = [];
      const maxW = canvas!.width - 60;

      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx!.measureText(test).width > maxW && line) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);

      const lineH = 36;
      const startY = cy - ((lines.length - 1) * lineH) / 2;
      lines.forEach((l, i) => ctx!.fillText(l, cx, startY + i * lineH));

      // Progress bar
      ctx!.globalAlpha = 0.6;
      ctx!.fillStyle = "rgba(255,255,255,0.15)";
      ctx!.fillRect(30, canvas!.height - 20, canvas!.width - 60, 4);
      ctx!.fillStyle = "#f97316";
      ctx!.fillRect(30, canvas!.height - 20, (canvas!.width - 60) * progress, 4);
      ctx!.globalAlpha = 1;

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(draw);
      } else {
        setAnimating(false);
      }
    }

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(draw);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (credits < 1) {
      setError("Sem tokens. Compre um plano abaixo.");
      return;
    }
    setLoading(true);
    setError("");
    setResultado(null);
    setVideoBlob(null);
    window.speechSynthesis?.cancel();
    setPlaying(false);

    try {
      const res = await fetch("/api/gerar-anuncio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto: form.produto,
          beneficio: form.beneficio,
          preco: form.preco || undefined,
          estilo: form.estilo,
          voz: form.voz,
        }),
      });

      const remaining = parseInt(res.headers.get("X-Credits-Remaining") ?? String(credits - 1));

      if (res.status === 402) {
        const data = await res.json();
        setError(data.error);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao gerar anúncio");
      }

      const contentType = res.headers.get("Content-Type") ?? "";
      let audioUrl: string | null = null;
      let script = "";
      let linhas: string[] = [];
      let audioDisponivel = false;

      if (contentType.includes("audio/mpeg")) {
        audioDisponivel = true;
        const blob = await res.blob();
        audioUrl = URL.createObjectURL(blob);
        script = decodeURIComponent(res.headers.get("X-Script") ?? "");
        linhas = JSON.parse(decodeURIComponent(res.headers.get("X-Linhas") ?? "[]"));
      } else {
        const data = await res.json();
        script = data.script;
        linhas = data.linhas;
        audioDisponivel = false;
      }

      setCredits(remaining);
      setResultado({ script, linhas, audioUrl, audioDisponivel });

      // Start canvas animation
      setTimeout(() => {
        animateCanvas(linhas);
        if (audioUrl && audioRef.current) {
          audioRef.current.play();
          setPlaying(true);
        } else {
          playBrowserTTS(script);
        }
      }, 200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  function resetar() {
    setResultado(null);
    setVideoBlob(null);
    setPlaying(false);
    window.speechSynthesis?.cancel();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setAnimating(false);
  }

  function downloadAudio() {
    if (!resultado?.audioUrl) return;
    const a = document.createElement("a");
    a.href = resultado.audioUrl;
    a.download = `vozanuncio-${form.produto.replace(/\s+/g, "-")}.mp3`;
    a.click();
  }

  return (
    <div className="space-y-6">
      {/* Créditos */}
      <div className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
        credits < 1 ? "bg-red-500/10 border border-red-500/30" : "bg-orange-500/10 border border-orange-500/20"
      }`}>
        <span className={credits < 1 ? "text-red-300" : "text-orange-300"}>
          🎬 {credits} {credits === 1 ? "token restante" : "tokens restantes"}
        </span>
        <span className={`text-xs ${credits < 1 ? "text-red-400" : "text-white/40"}`}>
          {credits < 1 ? "Sem saldo — compre um plano" : "1 token = 1 anúncio completo"}
        </span>
      </div>

      {!resultado ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Nome do produto *</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500"
              placeholder="Ex: Tênis Esportivo Pro, Perfume Floral, Sofá 3 Lugares…"
              value={form.produto}
              onChange={(e) => setForm((f) => ({ ...f, produto: e.target.value }))}
              required
              maxLength={80}
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs mb-1.5">Principal benefício / diferencial *</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500"
              placeholder="Ex: entrega em 24h, qualidade premium, frete grátis…"
              value={form.beneficio}
              onChange={(e) => setForm((f) => ({ ...f, beneficio: e.target.value }))}
              required
              maxLength={120}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Preço (opcional)</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500"
                placeholder="Ex: R$49,90 ou €29.99"
                value={form.preco}
                onChange={(e) => setForm((f) => ({ ...f, preco: e.target.value }))}
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Voz</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-[#0d0d1e] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                value={form.voz}
                onChange={(e) => setForm((f) => ({ ...f, voz: e.target.value }))}
              >
                {VOZES.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-xs mb-2">Estilo do anúncio *</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ESTILOS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, estilo: e.id }))}
                  className={`rounded-xl border py-2.5 px-2 text-center transition-all ${
                    form.estilo === e.id
                      ? "border-orange-500 bg-orange-500/15"
                      : "border-white/10 bg-white/3 hover:border-white/30"
                  }`}
                >
                  <div className="text-xl mb-0.5">{e.emoji}</div>
                  <div className="text-white text-xs font-medium">{e.label}</div>
                  <div className="text-white/30 text-[10px]">{e.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
              {error.includes("crédito") && (
                <a href="#precos" className="text-orange-400 text-xs underline mt-1 inline-block">
                  Ver planos →
                </a>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || credits < 1 || !form.produto || !form.beneficio}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Gerando anúncio…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Gerar Anúncio (1 token 🎬)</>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Preview canvas */}
          <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black relative">
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="w-full h-full"
            />
            {animating && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                ● AO VIVO
              </div>
            )}
          </div>

          {/* Script */}
          <div className="rounded-xl border border-white/8 bg-white/3 p-4">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Script gerado</p>
            <p className="text-white text-sm leading-relaxed">{resultado.script}</p>
          </div>

          {/* Controles */}
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? "Pausar" : "Ouvir anúncio"}
            </button>

            {resultado.audioUrl && (
              <button
                type="button"
                onClick={downloadAudio}
                className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar MP3
              </button>
            )}

            <button
              type="button"
              onClick={resetar}
              className="flex items-center gap-2 border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Novo anúncio
            </button>
          </div>

          {!resultado.audioDisponivel && (
            <p className="text-white/30 text-xs">
              Pré-escuta via sintetizador de voz do browser. MP3 profissional disponível quando ElevenLabs estiver ativo.
            </p>
          )}

          {resultado.audioUrl && (
            <audio
              ref={audioRef}
              src={resultado.audioUrl}
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
          )}
        </div>
      )}
    </div>
  );
}
