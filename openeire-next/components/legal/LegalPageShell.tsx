import type { ReactNode } from "react";

export function LegalPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <article className="legal-content">{children}</article>
    </main>
  );
}
