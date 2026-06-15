import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Video, LogOut, Sparkles, Star, Zap } from "lucide-react";
import VideoCreator from "./VideoCreator";
import { getCredits } from "@/lib/credits";
import { PLANOS } from "@/lib/stripe";
import ComprarBtn from "@/components/ComprarBtn";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sucesso?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user;
  const credits = user.email ? await getCredits(user.email) : 3;
  const params = await searchParams;
  const sucesso = params.sucesso === "1";

  return (
    <div className="min-h-screen" style={{ background: "#080812" }}>
      {/* Nav */}
      <nav className="border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(8,8,18,0.8)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">VozAnúncio</span>
          </a>

          <div className="flex items-center gap-4">
            {user.image && (
              <img src={user.image} alt="" className="w-8 h-8 rounded-full ring-2 ring-orange-500/40 hidden sm:block" />
            )}
            <span className="text-white/50 text-sm hidden sm:block">{user.name?.split(" ")[0]}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
              <button type="submit" className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {sucesso && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-green-300 font-semibold">Pagamento confirmado!</p>
              <p className="text-white/50 text-sm">Seus créditos foram adicionados. Bora criar anúncios!</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Olá, {user.name?.split(" ")[0]}! 🎬
          </h1>
          <p className="text-white/50">Crie anúncios profissionais com IA em segundos.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Tokens", value: `🎬 ${credits}`, color: "from-orange-500 to-pink-600", Icon: Zap },
            { label: "Anúncios disponíveis", value: String(credits), color: "from-pink-600 to-purple-600", Icon: Sparkles },
            { label: "Plano atual", value: credits > 30 ? "Pago" : "Grátis", color: "from-purple-600 to-blue-600", Icon: Star },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="rounded-2xl border border-white/8 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-bold text-xl">{value}</p>
              <p className="text-white/40 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Creator */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-white/8 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
              <h2 className="text-white font-semibold text-lg mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                Criar anúncio
              </h2>
              <p className="text-white/40 text-sm mb-6">
                Preencha os detalhes do produto e gere um anúncio com voz IA na hora.
              </p>
              <VideoCreator initialCredits={credits} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Créditos card */}
            <div className="rounded-2xl border border-orange-500/20 p-5" style={{ background: "rgba(249,115,22,0.06)" }}>
              <p className="text-orange-300 text-xs font-semibold uppercase tracking-wider mb-2">Seus Tokens</p>
              <p className="text-4xl font-black text-white mb-1">🎬 {credits}</p>
              <p className="text-white/50 text-sm mb-4">
                Cada anúncio usa 1 token.<br />
                Script + voz + animação incluídos.
              </p>
              <a
                href="#precos"
                className="block text-center bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Comprar mais créditos →
              </a>
            </div>

            {/* Como usar */}
            <div className="rounded-2xl border border-white/8 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Como usar</p>
              <ol className="space-y-2">
                {[
                  "Escreva o nome do produto",
                  "Diga o benefício principal",
                  "Escolha o estilo de anúncio",
                  "Clique em Gerar",
                  "Ouça, baixe e publique!",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/50 text-xs">
                    <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Planos */}
            <div id="precos" className="space-y-2">
              {PLANOS.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-2xl border p-4 ${p.destaque ? "border-orange-500/40 bg-orange-500/8" : "border-white/8 bg-white/3"}`}
                >
                  {p.destaque && (
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider">Mais popular</span>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <p className="text-white font-semibold">{p.nome}</p>
                      <p className="text-white/40 text-xs">{p.descricao}</p>
                    </div>
                    <p className="text-white font-bold">{p.preco}</p>
                  </div>
                  <ComprarBtn planoId={p.id} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
