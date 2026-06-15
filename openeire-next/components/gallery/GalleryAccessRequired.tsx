import Link from "next/link";

export function GalleryAccessRequired({
  title = "Private gallery access required",
}: {
  title?: string;
}) {
  return (
    <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
      <div className="max-w-xl rounded-2xl border border-white/10 bg-gray-900/50 p-8 shadow-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-accent">
          Stock footage archive
        </p>
        <h1 className="font-serif text-3xl font-bold">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-400">
          Digital photos and videos remain protected behind the existing gallery
          access flow. Sign in or request access to view licensing-ready media.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/gallery-gate"
            className="rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-paper transition-colors hover:bg-brand-900"
          >
            Request Access
          </Link>
          <Link
            href="/gallery/physical"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Browse Prints
          </Link>
        </div>
      </div>
    </div>
  );
}
