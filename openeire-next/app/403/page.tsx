import type { Metadata } from "next";
import Link from "next/link";
import { ErrorPageShell } from "@/components/errors/ErrorPageShell";

export const metadata: Metadata = {
  title: "Access forbidden | OpenÉire Studios",
  description: "You do not have permission to view this page.",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <ErrorPageShell statusCode="403" title="Access Forbidden" message="You do not have permission to view this page. Sign in with an account that has access or return to the homepage.">
      <Link href="/login" className="inline-flex min-w-45 justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white">Log In</Link>
      <Link href="/" className="inline-flex min-w-45 justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10">Back Home</Link>
    </ErrorPageShell>
  );
}
