"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error");

  const messages: Record<string, string> = {
    Configuration: "Erro de configuração do servidor.",
    AccessDenied: "Acesso negado.",
    Verification: "Link expirado ou já usado.",
    Default: "Ocorreu um erro ao fazer login.",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Erro ao entrar</h1>
        <p style={{ color: "#888", marginBottom: "2rem" }}>{messages[error ?? "Default"] ?? messages.Default}</p>
        <Link href="/login" style={{ background: "#f97316", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "8px", textDecoration: "none" }}>
          Tentar novamente
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
