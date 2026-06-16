"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Loader2, Play, Pause, Download, Sparkles, RefreshCw,
  Video, Music2, Image as ImageIcon, ChevronRight, Check
} from "lucide-react";

type Estilo = "energetico" | "sofisticado" | "urgencia" | "emocional" | "humor";
type Formato = "916" | "11" | "169";

const ESTILOS: { id: Estilo; label: string; emoji: string; desc: string; cor: string }[] = [
  { id: "energetico", label: "Energético", emoji: "⚡", desc: "Impacto e ação", cor: "#f97316" },
  { id: "urgencia", label: "Urgência", emoji: "🔥", desc: "Escassez e pressa", cor: "#ef4444" },
  { id: "emocional", label: "Emocional", emoji: "💛", desc: "Conexão e desejo", cor: "#a855f7" },
  { id: "sofisticado", label: "Sofisticado", emoji: "💎", desc: "Premium e elegante", cor: "#eab308" },
  { id: "humor", label: "Humor", emoji: "😄", desc: "Divertido e viral", cor: "#22c55e" },
];

const VOZES = [
  { id: "feminina", label: "Feminina" },
  { id: "masculino", label: "Masculino" },
  { id: "jovem", label: "Jovem" },
  { id: "formal", label: "Formal" },
];

const FORMATOS: { id: Formato; label: string; w: number; h: number; icon: string }[] = [
  { id: "916", label: "TikTok / Reels (9:16)", w: 540, h: 960, icon: "📱" },
  { id: "11", label: "Feed quadrado (1:1)", w: 720, h: 720, icon: "⬜" },
  { id: "169", label: "YouTube / Horizontal (16:9)", w: 960, h: 540, icon: "🖥️" },
];

const ESTILO_CORES: Record<Estilo, { bg1: string; bg2: string; accent: string }> = {
  energetico: { bg1: "#1a0a00", bg2: "#2d1500", accent: "#f97316" },
  urgencia:   { bg1: "#1a0000", bg2: "#2d0808", accent: "#ef4444" },
  emocional:  { bg1: "#0d0020", bg2: "#1a0040", accent: "#a855f7" },
  sofisticado:{ bg1: "#0d0b00", bg2: "#1a1500", accent: "#eab308" },
  humor:      { bg1: "#00100a", bg2: "#001a10", accent: "#22c55e" },
};

interface Props { initialCredits: number }

export default function VideoCreator({ initialCredits }: Props) {
  const [credits, setCredits] = useState(initialCredits);
  const [form, setForm] = useState({
    produto: "",
    beneficio: "",
    preco: "",
    imagemUrl: "",
    estilo: "energetico" as Estilo,
    voz: "feminina",
    formato: "916" as Formato,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState("");
  const [resultado, setResultado] = useState<{
    script: string;
    linhas: string[];
    audioUrl: string | null;
    audioDisponivel: boolean;
    imagemUrl?: string;
    audioDuration: number;
  } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [previewImg, setPreviewImg] = useState<HTMLImageElement | null>(null);

  const formato = FORMATOS.find((f) => f.id === form.formato) ?? FORMATOS[0];

  // Preload product image when URL changes
  useEffect(() => {
    const url = resultado?.imagemUrl || form.imagemUrl;
    if (!url) { setPreviewImg(null); return; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setPreviewImg(img);
    img.onerror = () => setPreviewImg(null);
    img.src = url;
  }, [form.imagemUrl, resultado?.imagemUrl]);

  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, linhas: string[], elapsed: number, totalDuration: number, estilo: Estilo) => {
      const W = canvas.width;
      const H = canvas.height;
      const { bg1, bg2, accent } = ESTILO_CORES[estilo];
      const progress = Math.min(elapsed / totalDuration, 1);
      const numLinhas = linhas.length;
      const linhaInterval = totalDuration / numLinhas;
      const linhaIdx = Math.min(Math.floor(elapsed / linhaInterval), numLinhas - 1);
      const lineProgress = (elapsed % linhaInterval) / linhaInterval;
      const alpha = lineProgress < 0.15 ? lineProgress / 0.15 : lineProgress > 0.85 ? (1 - lineProgress) / 0.15 : 1;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, bg1);
      bgGrad.addColorStop(1, bg2);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Glow effect behind text area
      const glowY = previewImg ? H * 0.62 : H * 0.5;
      const glow = ctx.createRadialGradient(W / 2, glowY, 0, W / 2, glowY, W * 0.7);
      glow.addColorStop(0, accent + "33");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      let textAreaTop = H * 0.1;

      // Product image section
      if (previewImg) {
        const imgH = H * 0.5;
        const imgY = 0;
        // Draw image with cover crop
        const scale = Math.max(W / previewImg.width, imgH / previewImg.height);
        const dw = previewImg.width * scale;
        const dh = previewImg.height * scale;
        const dx = (W - dw) / 2;
        const dy = (imgH - dh) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, imgY, W, imgH);
        ctx.clip();
        ctx.drawImage(previewImg, dx, dy, dw, dh);
        ctx.restore();

        // Gradient overlay on image bottom
        const imgOverlay = ctx.createLinearGradient(0, imgH * 0.5, 0, imgH);
        imgOverlay.addColorStop(0, "rgba(0,0,0,0)");
        imgOverlay.addColorStop(1, bg1 + "ff");
        ctx.fillStyle = imgOverlay;
        ctx.fillRect(0, imgY, W, imgH);

        textAreaTop = imgH + H * 0.02;
      }

      // Accent line
      ctx.fillStyle = accent;
      ctx.fillRect(W * 0.35, textAreaTop, W * 0.3, 2);

      // Text area: centered vertically in the lower portion
      const textH = H - textAreaTop;
      const textCenterY = textAreaTop + textH * 0.4;

      // Current line
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const linha = linhas[linhaIdx] ?? "";
      const fontSize = W < 600 ? Math.floor(W * 0.065) : Math.floor(W * 0.055);
      ctx.font = `900 ${fontSize}px 'Arial', sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.shadowColor = accent;
      ctx.shadowBlur = 20;

      // Word wrap
      const words = linha.split(" ");
      const wrapLines: string[] = [];
      let line = "";
      const maxW = W - W * 0.12;
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > maxW && line) {
          wrapLines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      if (line) wrapLines.push(line);

      const lineH = fontSize * 1.3;
      const totalH = wrapLines.length * lineH;
      const startY = textCenterY - totalH / 2;
      wrapLines.forEach((l, i) => ctx.fillText(l, W / 2, startY + i * lineH));
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Line counter dots
      const dotY = H - (previewImg ? H * 0.12 : H * 0.09);
      const dotSpacing = 16;
      const dotsStartX = W / 2 - ((numLinhas - 1) * dotSpacing) / 2;
      for (let i = 0; i < numLinhas; i++) {
        ctx.beginPath();
        ctx.arc(dotsStartX + i * dotSpacing, dotY, i === linhaIdx ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = i === linhaIdx ? accent : "rgba(255,255,255,0.3)";
        ctx.fill();
      }

      // Progress bar
      const barY = H - H * 0.04;
      const barH = 3;
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(0, barY, W, barH);
      const barGrad = ctx.createLinearGradient(0, 0, W * progress, 0);
      barGrad.addColorStop(0, accent);
      barGrad.addColorStop(1, "#ffffff");
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, barY, W * progress, barH);

      // Watermark
      ctx.font = `bold ${Math.floor(W * 0.028)}px Arial`;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.textAlign = "right";
      ctx.fillText("VozAnúncio", W - W * 0.04, H * 0.03);
      ctx.textAlign = "center";
    },
    [previewImg]
  );

  const startAnimation = useCallback(
    (linhas: string[], estilo: Estilo, totalDuration: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const start = Date.now();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      function tick() {
        const elapsed = (Date.now() - start) / 1000;
        drawFrame(ctx!, canvas!, linhas, elapsed, totalDuration, estilo);
        if (elapsed < totalDuration + 0.5) {
          animFrameRef.current = requestAnimationFrame(tick);
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    },
    [drawFrame]
  );

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
      if (playing) { audioRef.current.pause(); setPlaying(false); }
      else { audioRef.current.play(); setPlaying(true); }
      return;
    }
    if (playing) { window.speechSynthesis?.cancel(); setPlaying(false); }
    else playBrowserTTS(resultado?.script ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (credits < 1) { setError("Sem tokens. Compre um plano abaixo."); return; }
    setLoading(true);
    setError("");
    setResultado(null);
    setRecorded(null);
    setPlaying(false);
    window.speechSynthesis?.cancel();

    try {
      setLoadingStep("Gerando script com IA...");
      const res = await fetch("/api/gerar-anuncio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto: form.produto,
          beneficio: form.beneficio,
          preco: form.preco || undefined,
          estilo: form.estilo,
          voz: form.voz,
          imagemUrl: form.imagemUrl || undefined,
        }),
      });

      if (res.status === 402) { const d = await res.json(); setError(d.error); return; }
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Erro"); }

      setLoadingStep("Finalizando...");
      const d = await res.json();
      const script: string = d.script;
      const linhas: string[] = d.linhas;
      const remaining: number = d.credits ?? credits - 1;
      const imagemUrl: string = d.imagemDataUrl ?? form.imagemUrl ?? "";

      let audioUrl: string | null = null;
      let audioDisponivel = false;
      let audioDuration = 8;

      if (d.audioBase64) {
        audioDisponivel = true;
        const binary = atob(d.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: "audio/mpeg" });
        audioUrl = URL.createObjectURL(blob);
        audioDuration = await new Promise((resolve) => {
          const a = new Audio(audioUrl!);
          a.onloadedmetadata = () => resolve(a.duration || 8);
          a.onerror = () => resolve(8);
        });
      }

      setCredits(remaining);
      setResultado({ script, linhas, audioUrl, audioDisponivel, imagemUrl, audioDuration });

      setTimeout(() => {
        startAnimation(linhas, form.estilo, audioDuration);
        if (audioUrl && audioRef.current) { audioRef.current.play(); setPlaying(true); }
        else playBrowserTTS(script);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  }

  async function gravarVideo() {
    if (!resultado || !canvasRef.current) return;
    setRecording(true);
    setRecorded(null);

    const canvas = canvasRef.current;
    const { linhas, audioUrl, audioDuration, audioDisponivel } = resultado;

    try {
      const canvasStream = canvas.captureStream(30);
      const chunks: Blob[] = [];

      if (audioUrl && audioDisponivel) {
        // Combine canvas + audio via Web Audio API
        const audioCtx = new AudioContext();
        const dest = audioCtx.createMediaStreamDestination();

        const resp = await fetch(audioUrl);
        const buf = await resp.arrayBuffer();
        const decoded = await audioCtx.decodeAudioData(buf);

        const gainVoice = audioCtx.createGain();
        gainVoice.gain.value = 1;
        gainVoice.connect(dest);

        const source = audioCtx.createBufferSource();
        source.buffer = decoded;
        source.connect(gainVoice);

        const combined = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...dest.stream.getAudioTracks(),
        ]);

        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
          ? "video/webm;codecs=vp9,opus"
          : "video/webm";

        const recorder = new MediaRecorder(combined, { mimeType });
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          setRecorded(URL.createObjectURL(blob));
          setRecording(false);
          audioCtx.close();
        };

        recorder.start(100);
        startAnimation(linhas, resultado ? form.estilo : "energetico", audioDuration);
        source.start();

        setTimeout(() => {
          if (recorder.state !== "inactive") recorder.stop();
        }, (audioDuration + 0.8) * 1000);
      } else {
        // Canvas only (no audio)
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm";
        const recorder = new MediaRecorder(canvasStream, { mimeType });
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          setRecorded(URL.createObjectURL(blob));
          setRecording(false);
        };
        recorder.start(100);
        startAnimation(linhas, form.estilo, audioDuration);
        setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); }, (audioDuration + 0.8) * 1000);
      }
    } catch {
      setRecording(false);
      setError("Erro ao gravar vídeo. Tente baixar o MP3.");
    }
  }

  function downloadFile(url: string, name: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  }

  function resetar() {
    setResultado(null);
    setRecorded(null);
    setPlaying(false);
    window.speechSynthesis?.cancel();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setError("");
  }

  const canvasDisplay = formato.id === "916"
    ? { w: 270, h: 480 }
    : formato.id === "11"
    ? { w: 400, h: 400 }
    : { w: 480, h: 270 };

  return (
    <div className="space-y-5">
      {/* Tokens banner */}
      <div className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
        credits < 1 ? "bg-red-500/10 border border-red-500/30" : "bg-orange-500/10 border border-orange-500/20"
      }`}>
        <span className={credits < 1 ? "text-red-300" : "text-orange-300"}>
          🎬 {credits} {credits === 1 ? "token restante" : "tokens restantes"}
        </span>
        <span className="text-white/40 text-xs">1 token = 1 anúncio completo com IA</span>
      </div>

      {!resultado ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Produto + Benefício */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1.5 font-medium">Nome do produto *</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Ex: Tênis Air Pro, Perfume Floral..."
                value={form.produto}
                onChange={(e) => setForm((f) => ({ ...f, produto: e.target.value }))}
                required minLength={2} maxLength={80}
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5 font-medium">Benefício / diferencial *</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Ex: entrega 24h, frete grátis, qualidade premium..."
                value={form.beneficio}
                onChange={(e) => setForm((f) => ({ ...f, beneficio: e.target.value }))}
                required minLength={5} maxLength={120}
              />
            </div>
          </div>

          {/* Preço + URL imagem */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1.5 font-medium">Preço (opcional)</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Ex: R$49,90 ou €29.99"
                value={form.preco}
                onChange={(e) => setForm((f) => ({ ...f, preco: e.target.value }))}
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5 font-medium flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-orange-400" />
                URL da imagem do produto (opcional)
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="https://..."
                type="url"
                value={form.imagemUrl}
                onChange={(e) => setForm((f) => ({ ...f, imagemUrl: e.target.value }))}
              />
            </div>
          </div>

          {/* Voz + Formato */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs mb-1.5 font-medium">Voz</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-[#0d0d1e] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                value={form.voz}
                onChange={(e) => setForm((f) => ({ ...f, voz: e.target.value }))}
              >
                {VOZES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5 font-medium flex items-center gap-1">
                <Video className="w-3 h-3 text-orange-400" />
                Formato do vídeo
              </label>
              <select
                className="w-full rounded-xl border border-white/10 bg-[#0d0d1e] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                value={form.formato}
                onChange={(e) => setForm((f) => ({ ...f, formato: e.target.value as Formato }))}
              >
                {FORMATOS.map((f) => <option key={f.id} value={f.id}>{f.icon} {f.label}</option>)}
              </select>
            </div>
          </div>

          {/* Estilo */}
          <div>
            <label className="block text-white/60 text-xs mb-2 font-medium">Estilo do anúncio *</label>
            <div className="grid grid-cols-5 gap-2">
              {ESTILOS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, estilo: e.id }))}
                  className={`rounded-xl border py-3 px-1 text-center transition-all ${
                    form.estilo === e.id
                      ? "border-orange-500 bg-orange-500/15 scale-105"
                      : "border-white/10 bg-white/3 hover:border-white/30"
                  }`}
                >
                  <div className="text-2xl mb-0.5">{e.emoji}</div>
                  <div className="text-white text-[10px] font-semibold">{e.label}</div>
                  <div className="text-white/30 text-[9px]">{e.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || credits < 1 || !form.produto || !form.beneficio}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {loadingStep || "Gerando..."}</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Gerar Anúncio com IA (1 token 🎬)</>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          {/* Canvas preview */}
          <div className="flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/50"
              style={{ width: canvasDisplay.w, height: canvasDisplay.h }}>
              <canvas
                ref={canvasRef}
                width={formato.w}
                height={formato.h}
                style={{ width: canvasDisplay.w, height: canvasDisplay.h }}
              />
              {recording && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" /> GRAVANDO
                </div>
              )}
              {recorded && !recording && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> PRONTO
                </div>
              )}
            </div>
            <p className="text-white/30 text-xs mt-2">{formato.label} · {formato.w}×{formato.h}px</p>
          </div>

          {/* Script */}
          <div className="rounded-xl border border-white/8 bg-white/3 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Script gerado por IA</p>
            </div>
            <div className="space-y-1">
              {resultado.linhas.map((l, i) => (
                <p key={i} className="text-white text-sm leading-relaxed">
                  <span className="text-orange-500/60 text-xs mr-1">{i + 1}.</span> {l}
                </p>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold py-3 rounded-xl transition-colors"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? "Pausar" : "▶ Ouvir"}
            </button>

            <button
              onClick={gravarVideo}
              disabled={recording}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-colors"
            >
              {recording
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Gravando...</>
                : <><Video className="w-4 h-4" /> Gravar vídeo</>
              }
            </button>

            {resultado.audioUrl && (
              <button
                onClick={() => downloadFile(resultado.audioUrl!, `vozanuncio-${form.produto.replace(/\s+/g, "-")}.mp3`)}
                className="flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
              >
                <Music2 className="w-4 h-4" /> Baixar MP3
              </button>
            )}

            {recorded && (
              <button
                onClick={() => downloadFile(recorded, `vozanuncio-${form.produto.replace(/\s+/g, "-")}.webm`)}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-3 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Baixar WebM
              </button>
            )}

            <button
              onClick={resetar}
              className={`flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 text-white/50 hover:text-white text-sm py-3 rounded-xl transition-colors ${recorded ? "" : "col-span-2"}`}
            >
              <RefreshCw className="w-4 h-4" /> Novo anúncio <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {recording && (
            <p className="text-white/40 text-xs text-center">
              Aguarde... o vídeo será gerado automaticamente ao terminar a gravação
            </p>
          )}

          {!resultado.audioDisponivel && (
            <p className="text-white/40 text-xs text-center">
              Voz via browser (sem créditos OpenAI).{" "}
              <a href="https://platform.openai.com/settings/billing/overview" target="_blank" rel="noopener" className="underline hover:text-white/70">
                Adicionar créditos →
              </a>
            </p>
          )}

          {resultado.audioUrl && (
            <audio ref={audioRef} src={resultado.audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
          )}
        </div>
      )}
    </div>
  );
}
