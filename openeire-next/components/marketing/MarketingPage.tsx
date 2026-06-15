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
  icon?: ReactNode;
  title: string;
  text: string;
};

const buttonClass = (variant: LinkButton["variant"] = "primary") =>
  variant === "secondary"
    ? "inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10"
    : "inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 text-center text-sm font-bold text-black transition-colors hover:bg-accent";

export function HeroSection({
  eyebrow,
  title,
  description,
  image = PUBLIC_IMAGES.heroPoster,
  actions = [],
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  actions?: LinkButton[];
  note?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-black">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0)_55%),linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.82)_100%)]" />
      <div className="container relative z-10 mx-auto px-4 pb-8 pt-[calc(var(--site-header-height,0px)+0.75rem)] sm:pt-[calc(var(--site-header-height,0px)+1rem)] md:pb-20 md:pt-28 lg:px-8">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-accent/30 bg-black/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-3xl font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
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
          {note ? (
            <div className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400">
              {note}
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
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="container mx-auto px-4 pt-8 md:pt-20 lg:px-8">
      <div className="mb-8 max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">
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
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          {item.icon ? (
            <div className="text-2xl text-accent p-2">{item.icon}</div>
          ) : null}
          <h3 className="font-serif text-xl font-bold text-white">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            {item.text}
          </p>
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
          className="rounded-2xl border border-white/10 bg-black/35 p-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
            Step {index + 1}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">{step}</p>
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
    <section className="container mx-auto px-4 pb-20 pt-8 md:pt-20 lg:px-8">
      <div className="rounded-4xl border border-white/10 bg-linear-to-r from-white/8 to-white/5 p-5 md:p-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch">
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
    <div className="rounded-[28px] border border-white/10 bg-black/40 p-5 text-sm leading-relaxed text-gray-300 md:p-6">
      {children}
    </div>
  );
}
