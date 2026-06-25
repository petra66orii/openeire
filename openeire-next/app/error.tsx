"use client";

import Link from "next/link";
import { ErrorPageShell } from "@/components/errors/ErrorPageShell";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorPageShell statusCode="500" title="Something Went Wrong" message="An unexpected error occurred. Please try again or return to the homepage.">
      <button type="button" onClick={reset} className="inline-flex min-w-45 justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white">Try Again</button>
      <Link href="/" className="inline-flex min-w-45 justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10">Back Home</Link>
    </ErrorPageShell>
  );
}
