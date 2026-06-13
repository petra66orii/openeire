import Link from "next/link";
import type { ReactNode } from "react";
import { PUBLIC_IMAGES } from "@/lib/assets";

type LinkButton = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export type CardItem = {
  id?: string;
  title: string;
  text: string;
};

const buttonClass = (variant: LinkButton["variant"] = "primary") =>
  variant === "secondary"
    ? "inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
    : "inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-500";

export function HeroSection({
  eyebrow,
  title,
  description,
  image = PUBLIC_IMAGES.heroPoster,
  actions = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  actions?: LinkButton[];
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-black">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.24),transparent_34rem),linear-gradient(180deg,rgba(0,0,0,0.24),rgba(0,0,0,0.9))]" />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8 lg:py-36">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-emerald-400/30 bg-black/45 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
            {eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
            {description}
          </p>
          {actions.length > 0 ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={buttonClass(action.variant)}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function PageSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
      <div className="mb-8 max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function CardGrid({
  items,
  columns = 3,
}: {
  items: CardItem[];
  columns?: 2 | 3;
}) {
  return (
    <div
      className={
        columns === 2
          ? "grid gap-5 md:grid-cols-2"
          : "grid gap-5 md:grid-cols-3"
      }
    >
      {items.map((item, index) => (
        <article
          key={item.id ?? `${item.title}-${index}`}
          className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20"
        >
          <h3 className="font-serif text-xl font-bold text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/65">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function NumberedSteps({ steps }: { steps: string[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {steps.map((step, index) => (
        <article
          key={`${step}-${index}`}
          className="rounded-3xl border border-white/10 bg-black/35 p-6"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
            Step {index + 1}
          </p>
          <p className="mt-3 text-sm leading-7 text-white/70">{step}</p>
        </article>
      ))}
    </div>
  );
}

export function CtaBand({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions: LinkButton[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-emerald-950/40 p-7 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-white">{title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={buttonClass(action.variant)}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TextPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 text-sm leading-7 text-white/70 sm:p-8">
      {children}
    </div>
  );
}
