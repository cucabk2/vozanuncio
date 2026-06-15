import { Video, Zap, Download, TrendingUp, Check } from "lucide-react";

const ESTILOS = [
  { emoji: "⚡", nome: "Energético" },
  { emoji: "🔥", nome: "Urgência" },
  { emoji: "💛", nome: "Emocional" },
  { emoji: "💎", nome: "Sofisticado" },
  { emoji: "😄", nome: "Humor" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#080812" }}>
      {/* Nav */}
      <nav className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">VozAnúncio</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#precos" className="text-white/60 hover:text-white text-sm transition-colors hidden sm:block">
              Preços
            </a>
            <a
              href="/dashboard"
              className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              Começar grátis
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-orange-300 text-xs font-semibold mb-6">
          <Zap className="w-3 h-3" />
          Novo: Anúncio com voz IA em 30 segundos
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
          Foto do produto →
          <br />
          <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            Anúncio profissional
          </span>
          <br />
          em 2 minutos
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          IA gera o script, a voz e a animação do anúncio automaticamente.
          Pronto para TikTok, Instagram e Facebook Ads.
          Sem edição. Sem experiência. Sem custo inicial.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/dashboard"
            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-lg font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Criar meu primeiro anúncio grátis →
          </a>
          <a
            href="#como-funciona"
            className="border border-white/20 text-white text-lg font-semibold px-8 py-4 rounded-2xl hover:bg-white/5 transition-colors"
          >
            Ver como funciona
          </a>
        </div>

        <p className="text-white/30 text-sm mt-4">3 anúncios grátis. Sem cartão de crédito.</p>
      </section>

      {/* Demo visual */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1a0533] to-[#0d1a3a] aspect-video flex items-center justify-center relative">
          <div className="text-center space-y-4 px-8">
            <div className="text-6xl">⚡</div>
            <p className="text-3xl font-black text-white">Olha só isso! Tênis Esportivo Pro!</p>
            <p className="text-xl text-white/70">Entrega em 24h, qualidade premium.</p>
            <p className="text-2xl font-bold text-orange-400">Por apenas R$149,90!</p>
            <p className="text-lg text-white/80">Não perde tempo. Garante o teu agora!</p>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-4 left-8 right-8 h-1 bg-white/10 rounded-full">
            <div className="h-full w-2/3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full" />
          </div>
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            ● EXEMPLO
          </div>
          <div className="absolute top-4 left-4 text-white/30 text-xs font-bold">VozAnúncio</div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">
          Simples como 1-2-3
        </h2>
        <p className="text-white/50 text-center mb-12">Do produto ao anúncio em menos de 2 minutos</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              titulo: "Descreva o produto",
              desc: "Nome do produto, benefício principal e preço (opcional). Leva 20 segundos.",
              icon: "📝",
            },
            {
              step: "2",
              titulo: "Escolha o estilo",
              desc: "Energético, urgência, emocional, sofisticado ou humor. IA adapta o script.",
              icon: "🎯",
            },
            {
              step: "3",
              titulo: "Baixe e publique",
              desc: "Receba o MP3 com voz profissional e publique direto no TikTok ou Instagram.",
              icon: "🚀",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-white/8 p-6 text-center"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold mb-3">
                {item.step}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{item.titulo}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Estilos */}
      <section className="max-w-6xl mx-auto px-4 py-10 pb-20">
        <h2 className="text-2xl font-black text-white text-center mb-8">5 estilos de anúncio</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {ESTILOS.map((e) => (
            <div
              key={e.nome}
              className="rounded-2xl border border-white/10 bg-white/3 px-5 py-3 flex items-center gap-2"
            >
              <span className="text-2xl">{e.emoji}</span>
              <span className="text-white font-semibold">{e.nome}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section className="max-w-6xl mx-auto px-4 py-10 pb-20">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Anúncio pronto em menos de 2 minutos",
            "Voz profissional com IA (ElevenLabs)",
            "5 estilos diferentes para cada objetivo",
            "Script gerado automaticamente pela IA",
            "Compatível com TikTok, Reels e Facebook Ads",
            "Sem edição, sem softwares, sem cursos",
            "Download MP3 para usar em qualquer lugar",
            "Funciona para qualquer produto ou nicho",
          ].map((b) => (
            <div key={b} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-orange-400" />
              </div>
              <span className="text-white/70 text-sm">{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">Preços simples</h2>
        <p className="text-white/50 text-center mb-12">Comece grátis, compre créditos quando precisar</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { nome: "Grátis", preco: "R$0", credits: 3, items: ["3 anúncios grátis", "Todos os estilos", "Script + voz IA", "Download MP3"], destaque: false, cta: "Começar grátis", href: "/dashboard" },
            { nome: "Popular", preco: "R$47", credits: 30, items: ["30 anúncios", "Todos os estilos", "Script + voz IA", "Download MP3", "Histórico completo"], destaque: true, cta: "Comprar 30 anúncios", href: "/dashboard" },
            { nome: "Profissional", preco: "R$97", credits: 100, items: ["100 anúncios", "Todos os estilos", "Script + voz IA", "Download MP3", "Histórico completo", "Prioridade no suporte"], destaque: false, cta: "Comprar 100 anúncios", href: "/dashboard" },
          ].map((plano) => (
            <div
              key={plano.nome}
              className={`rounded-2xl border p-6 ${plano.destaque ? "border-orange-500/50 bg-orange-500/8" : "border-white/8 bg-white/3"}`}
            >
              {plano.destaque && (
                <div className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">⭐ Mais popular</div>
              )}
              <h3 className="text-white font-bold text-xl mb-1">{plano.nome}</h3>
              <p className="text-3xl font-black text-white mb-1">{plano.preco}</p>
              <p className="text-white/40 text-sm mb-5">{plano.credits} créditos de anúncio</p>
              <ul className="space-y-2 mb-6">
                {plano.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                    <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={plano.href}
                className={`block text-center font-semibold py-3 rounded-xl transition-opacity ${
                  plano.destaque
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:opacity-90"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {plano.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-3xl mx-auto px-4 pb-24 text-center">
        <div className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-10">
          <TrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Seus concorrentes já estão usando IA.
          </h2>
          <p className="text-white/50 mb-6">
            Vendedores que usam anúncios com voz profissional vendem até 3x mais.
            Comece hoje com 3 anúncios grátis.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Criar meu primeiro anúncio grátis →
          </a>
        </div>
      </section>

      <footer className="border-t border-white/5 py-6 text-center">
        <p className="text-white/20 text-sm">© 2026 VozAnúncio. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
