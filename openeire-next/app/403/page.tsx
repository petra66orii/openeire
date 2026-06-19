import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Access denied | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-20 text-center text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
          Access denied
        </p>
        <h1 className="font-serif text-3xl font-bold">
          This area is for staff accounts only.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-400">
          If you believe you should have access, sign in with the correct staff
          account or contact the site owner.
        </p>
        <Link
          href="/profile"
          className="mt-8 inline-flex rounded-xl border border-white/15 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-black"
        >
          Back to account
        </Link>
      </div>
    </div>
  );
}
