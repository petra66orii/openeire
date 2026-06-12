type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-400">
        Next.js foundation
      </p>
      <h1 className="mt-4 font-serif text-4xl font-bold text-white md:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
        {description}
      </p>
      <p className="mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
        Placeholder only. Page content, data fetching, structured data, and UI
        migration are intentionally deferred to the next PR.
      </p>
    </section>
  );
}
