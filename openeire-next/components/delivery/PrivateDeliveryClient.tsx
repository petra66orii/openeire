"use client";

import { useEffect, useRef, useState } from "react";

type DeliveryState =
  | "bootstrapping"
  | "valid"
  | "payment_locked"
  | "temporarily_unavailable"
  | "empty"
  | "unavailable"
  | "error";

interface Deliverable {
  id: string;
  category: string;
  category_label: string;
  display_name: string;
  filename: string;
  size: number;
  mime_type: string;
}

interface DeliveryDto {
  title: string;
  available_from: string;
  expires_at: string;
  licence_summary: string;
  download_instructions: string;
  review_url: string;
  partial_availability: boolean;
  groups: Array<{ category: string; files: Deliverable[] }>;
}

const stateCopy: Record<
  Exclude<DeliveryState, "bootstrapping" | "valid">,
  { title: string; message: string }
> = {
  payment_locked: {
    title: "Delivery not yet released",
    message:
      "This delivery is securely prepared, but access is still awaiting payment clearance. Please contact OpenÉire Studios if you need help.",
  },
  temporarily_unavailable: {
    title: "Delivery not available yet",
    message:
      "This private delivery is not currently available. Please try the link again later or contact OpenÉire Studios.",
  },
  empty: {
    title: "Files are being prepared",
    message:
      "Your delivery is active, but no files are available yet. Please check again shortly.",
  },
  unavailable: {
    title: "Delivery unavailable",
    message:
      "This private delivery link is invalid or no longer available. Please contact OpenÉire Studios for assistance.",
  },
  error: {
    title: "Temporarily unavailable",
    message:
      "We could not load this delivery just now. Please retry, or contact OpenÉire Studios if the problem continues.",
  },
};

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "File";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 || unit === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
};

const parseState = (value: unknown): DeliveryState => {
  if (
    value === "valid" ||
    value === "payment_locked" ||
    value === "temporarily_unavailable" ||
    value === "empty" ||
    value === "unavailable"
  ) {
    return value;
  }
  return "error";
};

export function PrivateDeliveryClient({
  recipientPublicId,
}: {
  recipientPublicId: string;
}) {
  const startedRef = useRef(false);
  const [state, setState] = useState<DeliveryState>("bootstrapping");
  const [delivery, setDelivery] = useState<DeliveryDto | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;

    const loadSession = async () => {
      const response = await fetch("/api/delivery/session", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload: unknown = await response.json();
      if (cancelled || !payload || typeof payload !== "object") return;
      const result = payload as {
        state?: unknown;
        delivery?: unknown;
        preview?: unknown;
      };
      const nextState = parseState(result.state);
      setState(nextState);
      setDelivery(
        nextState === "valid" && result.delivery
          ? (result.delivery as DeliveryDto)
          : null,
      );
      setIsPreview(result.preview === true);
    };

    const bootstrap = async () => {
      try {
        const fragmentSecret = window.location.hash.slice(1);
        if (fragmentSecret) {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}`,
          );
          const response = await fetch("/api/delivery/exchange", {
            method: "POST",
            credentials: "same-origin",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              public_id: recipientPublicId,
              secret: fragmentSecret,
            }),
          });
          const payload: unknown = await response.json();
          if (cancelled || !payload || typeof payload !== "object") return;
          const exchangeState = parseState(
            (payload as { state?: unknown }).state,
          );
          if (!response.ok || exchangeState !== "valid") {
            setState(exchangeState);
            return;
          }
        }
        await loadSession();
      } catch {
        if (!cancelled) setState("error");
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [recipientPublicId, retryKey]);

  const retry = () => {
    startedRef.current = false;
    setState("bootstrapping");
    setRetryKey((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
          <a
            href="https://openeire.ie"
            className="rounded-sm text-xl font-extrabold tracking-tight text-white outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="OpenÉire Studios home"
          >
            OpenÉire <span className="text-amber-400">Studios</span>
          </a>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Private delivery
          </span>
        </header>

        {state === "bootstrapping" && (
          <section aria-live="polite" aria-busy="true" className="py-20 text-center">
            <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
            <h1 className="text-2xl font-bold">Opening your private delivery</h1>
            <p className="mt-3 text-zinc-400">Securely checking access…</p>
          </section>
        )}

        {state === "valid" && delivery && (
          <>
            {isPreview && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-sky-400/30 bg-sky-950/40 p-4 text-sm text-sky-100"
              >
                Staff preview — downloads are disabled and recipient access is unchanged.
              </div>
            )}
            <section className="mb-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
                Media delivery
              </p>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
                {delivery.title}
              </h1>
              <p className="mt-5 text-sm text-zinc-400">
                Available from{" "}
                <time dateTime={delivery.available_from}>
                  {new Intl.DateTimeFormat("en-IE", {
                    dateStyle: "long",
                  }).format(new Date(delivery.available_from))}
                </time>
                {" "}until{" "}
                <time dateTime={delivery.expires_at}>
                  {new Intl.DateTimeFormat("en-IE", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(delivery.expires_at))}
                </time>
              </p>
            </section>

            {delivery.partial_availability && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-amber-400/30 bg-amber-950/30 p-4 text-sm text-amber-100"
              >
                Some files are still being prepared. Available files are listed below.
              </div>
            )}

            {new URLSearchParams(
              typeof window === "undefined" ? "" : window.location.search,
            ).get("download") === "failed" && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-400/30 bg-red-950/40 p-4 text-sm text-red-100"
              >
                We could not generate that download. Please try again.
              </div>
            )}

            <div className="space-y-8">
              {delivery.groups.map((group) => (
                <section key={group.category} aria-labelledby={`group-${group.category}`}>
                  <h2
                    id={`group-${group.category}`}
                    className="mb-3 text-xl font-bold text-white"
                  >
                    {group.files[0]?.category_label ?? "Files"}
                  </h2>
                  <ul className="grid gap-3">
                    {group.files.map((file) => (
                      <li
                        key={file.id}
                        className="flex min-w-0 flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <h3 className="break-words font-semibold text-white">
                            {file.display_name}
                          </h3>
                          <p className="mt-1 break-all text-sm text-zinc-400">
                            {file.filename} · {formatBytes(file.size)}
                          </p>
                        </div>
                        <form method="post" action="/api/delivery/download">
                          <input type="hidden" name="deliverable_id" value={file.id} />
                          <input
                            type="hidden"
                            name="recipient_public_id"
                            value={recipientPublicId}
                          />
                          <button
                            type="submit"
                            disabled={isPreview}
                            aria-label={`Download ${file.display_name}`}
                            className="w-full rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 outline-none transition hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300 sm:w-auto"
                          >
                            {isPreview ? "Preview only" : "Download"}
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            {(delivery.download_instructions || delivery.licence_summary) && (
              <aside className="mt-10 grid gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
                {delivery.download_instructions && (
                  <div>
                    <h2 className="font-bold text-white">Download instructions</h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">
                      {delivery.download_instructions}
                    </p>
                  </div>
                )}
                {delivery.licence_summary && (
                  <div>
                    <h2 className="font-bold text-white">Licence and use</h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">
                      {delivery.licence_summary}
                    </p>
                  </div>
                )}
              </aside>
            )}
          </>
        )}

        {state !== "bootstrapping" && state !== "valid" && (
          <section aria-live="polite" className="mx-auto max-w-xl py-20 text-center">
            <h1 className="text-3xl font-bold">{stateCopy[state].title}</h1>
            <p className="mt-4 leading-7 text-zinc-300">{stateCopy[state].message}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {(state === "error" || state === "temporarily_unavailable") && (
                <button
                  type="button"
                  onClick={retry}
                  className="rounded-lg bg-amber-400 px-5 py-3 font-bold text-zinc-950 outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Try again
                </button>
              )}
              <a
                href="mailto:hello@openeire.ie"
                className="rounded-lg border border-white/20 px-5 py-3 font-semibold text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Contact support
              </a>
            </div>
          </section>
        )}

        <footer className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Private media service by OpenÉire Studios.</p>
          <nav aria-label="Delivery links" className="flex gap-5">
            {delivery?.review_url && (
              <a
                className="underline hover:text-white"
                href={delivery.review_url}
                rel="noreferrer"
              >
                Leave a review
              </a>
            )}
            <a className="underline hover:text-white" href="/real-estate">
              Book another shoot
            </a>
            <a className="underline hover:text-white" href="mailto:hello@openeire.ie">
              Support
            </a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
