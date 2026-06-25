import Link from "next/link";
import type { ReactNode } from "react";

export function ErrorPageShell({
  statusCode,
  title,
  message,
  children,
}: {
  statusCode: "403" | "404" | "500";
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <main className="page-top-offset relative min-h-[70vh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.16),transparent_55%)]" />
      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-6 pb-20 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-brand-500">
          Error {statusCode}
        </p>
        <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-gray-300 md:text-lg">
          {message}
        </p>
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          {children ?? (
            <Link
              href="/"
              className="inline-flex min-w-45 justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              Back Home
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
