"use client";
import { useState } from "react";
import { Video, Zap, Download, TrendingUp, Check, ChevronDown, Play, Star, Mic, Globe, Shield } from "lucide-react";

const ESTILOS = [
  { emoji: "⚡", nome: "Energético", desc: "Impacto imediato, ação rápida", exemplo: "Olha só isso! Não perde tempo. Garante AGORA!" },
  { emoji: "🔥", nome: "Urgência", desc: "Escassez real, decisão rápida", exemplo: "ATENÇÃO! Estoque limitadíssimo. Corre antes que acabe!" },
  { emoji: "💛", nome: "Emocional", desc: "Conexão, desejo, sonho", exemplo: "Imagina ter isso... Você merece. Pede o teu hoje." },
  { emoji: "💎", nome: "Sofisticado", desc: "Premium, exclusivo, status", exemplo: "Para quem sabe o que quer. Qualidade sem compromisso." },
  { emoji: "😄", nome: "Humor", desc: "Viral, divertido, memorável", exemplo: "Ei, isso existe! E o preço vai te surpreender. Corre lá!" },
];

const FAQS = [
  { q: "Como funciona o sistema de tokens?", r: "Cada anúncio gerado consome 1 token. Ao criar sua conta você recebe 30 tokens grátis — suficiente para testar 30 anúncios diferentes sem pagar nada." },
  { q: "A voz gerada é profissional?", r: "Sim. Usamos a API da ElevenLabs, a mesma tecnologia usada por grandes estúdios. O resultado é indistinguível de um locutor humano." },
  { q: "Posso usar os anúncios no TikTok e Instagram?", r: "Sim. O áudio MP3 gerado é compatível com qualquer plataforma: TikTok, Instagram Reels, Facebook Ads, YouTube, WhatsApp e mais." },
  { q: "Os tokens expiram?", r: "Não. Os tokens que você compra não têm prazo de validade. Use no seu ritmo." },
  { q: "Posso cancelar quando quiser?", r: "Sim. Nossos planos são pagamentos únicos, não assinaturas. Você compra tokens quando precisar, sem compromisso mensal." },
];

export default function HomePage() {
  const [estiloAtivo, setEstiloAtivo] = useState(0);
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "#060610" }}>

      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-center py-2 text-sm font-medium">
        🎉 Novidade: 30 tokens grátis ao criar sua conta — sem cartão de crédito
      </div>

      {/* Nav */}
      <nav className="border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(6,6,16,0.9)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white text-xl tracking-tight">VozAnúncio</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {[["#como-funciona", "Como funciona"], ["#estilos", "Estilos"], ["#planos", "Planos"], ["#faq", "FAQ"]].map(([href, label]) => (
              <a key={href} href={href} className="text-white/50 hover:text-white text-sm font-medium transition-colors">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors hidden sm:block">
              Entrar
            </a>
            <a href="/dashboard" className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
              Começar grátis →
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-16 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #f97316 0%, #ec4899 50%, transparent 70%)" }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-orange-300 text-xs font-semibold mb-8">
            <Zap className="w-3 h-3" />
            IA gera seu anúncio em menos de 30 segundos
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Anúncios com voz
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              profissional por IA
            </span>
            <br />
            em 2 minutos
          </h1>

          <p className="text-white/50 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Descreve o produto, escolhe o estilo e a IA cria o script + voz +
            animação automaticamente. Pronto para TikTok, Reels e Facebook Ads.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-lg font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25">
              <Zap className="w-5 h-5" />
              Criar anúncio grátis
            </a>
            <a href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 border border-white/15 text-white text-lg font-semibold px-8 py-4 rounded-2xl hover:bg-white/5 transition-colors">
              <Play className="w-5 h-5" />
              Ver demo
            </a>
          </div>

          <p className="text-white/25 text-sm">30 tokens grátis · Sem cartão de crédito · Cancela quando quiser</p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { valor: "30", label: "tokens grátis", icon: "🎁" },
            { valor: "5", label: "estilos de anúncio", icon: "🎯" },
            { valor: "4", label: "vozes disponíveis", icon: "🎙️" },
            { valor: "30s", label: "tempo de geração", icon: "⚡" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/8 p-5 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-3xl font-black text-white">{s.valor}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Preview */}
      <section id="como-funciona" className="max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Simples como 1-2-3</h2>
          <p className="text-white/50 text-lg">Do produto ao anúncio profissional em menos de 2 minutos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { step: "01", icon: "📝", titulo: "Descreve o produto", desc: "Nome, benefício principal e preço. Leva 20 segundos.", cor: "from-orange-500 to-pink-500" },
            { step: "02", icon: "🎯", titulo: "Escolhe o estilo", desc: "Energético, urgência, emocional, sofisticado ou humor.", cor: "from-pink-500 to-purple-500" },
            { step: "03", icon: "🚀", titulo: "Baixa e publica", desc: "Recebe o MP3 profissional e publica direto nas redes.", cor: "from-purple-500 to-blue-500" },
          ].map((item) => (
            <div key={item.step} className="relative rounded-3xl border border-white/8 p-7 overflow-hidden group hover:border-white/20 transition-colors" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${item.cor}`} />
              <span className={`text-5xl font-black bg-gradient-to-r ${item.cor} bg-clip-text text-transparent opacity-20 absolute top-4 right-4`}>{item.step}</span>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{item.titulo}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Demo card */}
        <div className="rounded-3xl border border-white/10 overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0533 0%, #0d1a3a 100%)" }}>
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-white/30 text-xs">vozanuncio.vercel.app/dashboard</span>
            <div className="w-16" />
          </div>
          <div className="aspect-video flex items-center justify-center relative p-8">
            <div className="text-center space-y-3 max-w-lg">
              <div className="text-5xl">⚡</div>
              <p className="text-4xl font-black text-white leading-tight">Olha só isso! Tênis Air Pro!</p>
              <p className="text-xl text-white/70">Entrega em 24h, qualidade premium.</p>
              <p className="text-2xl font-bold text-orange-400">Por apenas R$149,90!</p>
              <p className="text-lg text-white/80">Não perde tempo. Garante o teu agora!</p>
            </div>
            <div className="absolute bottom-4 left-8 right-8">
              <div className="h-1 bg-white/10 rounded-full">
                <div className="h-full w-2/3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full" />
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              ● EXEMPLO
            </div>
            <div className="absolute bottom-8 right-8 flex gap-2">
              <button className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-colors">
                <Play className="w-3 h-3" /> Ouvir
              </button>
              <button className="border border-white/20 hover:bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-colors">
                <Download className="w-3 h-3" /> MP3
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Estilos */}
      <section id="estilos" className="max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">5 estilos de anúncio</h2>
          <p className="text-white/50 text-lg">Cada produto tem um tom ideal. Escolha o seu.</p>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {ESTILOS.map((e, i) => (
            <button
              key={e.nome}
              onClick={() => setEstiloAtivo(i)}
              className={`rounded-2xl border py-3 px-2 text-center transition-all ${estiloAtivo === i
                ? "border-orange-500 bg-orange-500/15 scale-105"
                : "border-white/8 bg-white/3 hover:border-white/20"
              }`}
            >
              <div className="text-2xl mb-1">{e.emoji}</div>
              <div className="text-white text-xs font-semibold">{e.nome}</div>
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-orange-500/20 p-8" style={{ background: "rgba(249,115,22,0.05)" }}>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{ESTILOS[estiloAtivo].emoji}</span>
            <div>
              <p className="text-orange-300 text-xs font-semibold uppercase tracking-wider mb-1">{ESTILOS[estiloAtivo].nome}</p>
              <p className="text-white/50 text-sm mb-3">{ESTILOS[estiloAtivo].desc}</p>
              <p className="text-white text-lg font-semibold italic">"{ESTILOS[estiloAtivo].exemplo}"</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/8 flex justify-end">
            <a href="/dashboard" className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
              Criar anúncio com este estilo →
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Por que VozAnúncio?</h2>
          <p className="text-white/50 text-lg">Tudo que você precisa para anúncios profissionais</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Mic, titulo: "Voz IA profissional", desc: "ElevenLabs — a mesma tecnologia de grandes estúdios. Voz natural, clara e persuasiva.", cor: "text-orange-400" },
            { icon: Zap, titulo: "Pronto em 30 segundos", desc: "IA gera script, voz e animação automaticamente. Sem edição. Sem experiência.", cor: "text-yellow-400" },
            { icon: Globe, titulo: "Para qualquer plataforma", desc: "MP3 compatível com TikTok, Reels, Facebook Ads, YouTube e WhatsApp.", cor: "text-green-400" },
            { icon: Star, titulo: "5 estilos testados", desc: "Energético, urgência, emocional, sofisticado e humor. Cada produto tem seu tom.", cor: "text-purple-400" },
            { icon: Shield, titulo: "Tokens sem validade", desc: "Compre uma vez e use quando quiser. Sem assinatura, sem renovação automática.", cor: "text-blue-400" },
            { icon: Download, titulo: "Download imediato", desc: "Receba o arquivo MP3 na hora. Publique direto no criador de anúncios da rede.", cor: "text-pink-400" },
          ].map(({ icon: Icon, titulo, desc, cor }) => (
            <div key={titulo} className="rounded-2xl border border-white/8 p-6 hover:border-white/20 transition-all hover:-translate-y-1 cursor-default" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${cor}`} />
              </div>
              <h3 className="text-white font-bold mb-2">{titulo}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="max-w-5xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Planos</h2>
          <p className="text-white/50 text-lg">Comece com 30 tokens grátis. Sem cartão de crédito.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              nome: "Grátis", preco: "R$0", tokens: 30, periodo: "para sempre",
              items: ["30 tokens grátis", "Todos os 5 estilos", "Script por IA", "Voz profissional", "Download MP3"],
              destaque: false, cta: "Começar grátis", href: "/dashboard",
            },
            {
              nome: "Popular", preco: "R$47", tokens: 300, periodo: "pagamento único",
              items: ["300 tokens", "Todos os 5 estilos", "Script por IA", "Voz profissional", "Download MP3", "Histórico de anúncios"],
              destaque: true, cta: "Comprar 300 tokens", href: "/dashboard",
            },
            {
              nome: "Profissional", preco: "R$97", tokens: 1000, periodo: "pagamento único",
              items: ["1000 tokens", "Todos os 5 estilos", "Script por IA", "Voz profissional", "Download MP3", "Histórico de anúncios", "Suporte prioritário"],
              destaque: false, cta: "Comprar 1000 tokens", href: "/dashboard",
            },
          ].map((plano) => (
            <div
              key={plano.nome}
              className={`relative rounded-3xl border p-7 flex flex-col transition-transform hover:-translate-y-1 ${plano.destaque
                ? "border-orange-500/50"
                : "border-white/8"
              }`}
              style={{ background: plano.destaque ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.03)" }}
            >
              {plano.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  ⭐ Mais popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-1">{plano.nome}</h3>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white">{plano.preco}</span>
                </div>
                <p className="text-white/30 text-xs mt-1">{plano.periodo} · {plano.tokens} tokens</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {plano.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                    <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={plano.href}
                className={`block text-center font-bold py-3.5 rounded-2xl transition-all ${plano.destaque
                  ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:opacity-90 shadow-lg shadow-orange-500/25"
                  : "border border-white/20 text-white hover:bg-white/8"
                }`}
              >
                {plano.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Perguntas frequentes</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
              <button
                onClick={() => setFaqAberto(faqAberto === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/3 transition-colors"
              >
                <span className="text-white font-semibold text-sm">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 ml-4 transition-transform ${faqAberto === i ? "rotate-180" : ""}`} />
              </button>
              {faqAberto === i && (
                <div className="px-6 pb-5">
                  <p className="text-white/50 text-sm leading-relaxed">{faq.r}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(236,72,153,0.15) 100%)", border: "1px solid rgba(249,115,22,0.2)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 70% 50%, #ec4899 0%, transparent 50%)" }} />
          <div className="relative">
            <TrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Comece a vender mais hoje
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Vendedores com anúncios em voz profissional vendem até 3× mais.
              30 tokens grátis para começar agora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-lg font-bold px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-orange-500/30">
                <Zap className="w-5 h-5" />
                Criar meu primeiro anúncio grátis
              </a>
            </div>
            <p className="text-white/30 text-sm mt-4">Sem cartão · 30 tokens grátis · Resultado em 30 segundos</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white">VozAnúncio</span>
          </div>
          <div className="flex items-center gap-6 text-white/30 text-sm">
            <a href="#planos" className="hover:text-white/60 transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white/60 transition-colors">FAQ</a>
            <a href="/dashboard" className="hover:text-white/60 transition-colors">Dashboard</a>
          </div>
          <p className="text-white/20 text-sm">© 2026 VozAnúncio</p>
        </div>
      </footer>
    </div>
  );
}
