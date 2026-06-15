"use client";
export default function ComprarBtn({ planoId, label }: { planoId: string; label?: string }) {
  async function handleComprar() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planoId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <button
      onClick={handleComprar}
      className="mt-3 w-full text-center text-sm font-semibold py-2 rounded-lg bg-white/8 hover:bg-white/15 text-white transition-colors"
    >
      {label ?? "Comprar"}
    </button>
  );
}
