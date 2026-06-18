"use client";

import Link from "next/link";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import type { UserProfile } from "@/types/auth";

export function GalleryAccessPanel({ user }: { user: UserProfile }) {
  const hasAccess = Boolean(user.can_access_gallery);

  return (
    <section aria-labelledby="gallery-access-heading">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h3
          id="gallery-access-heading"
          className="font-serif text-3xl font-bold text-white"
        >
          Gallery Access
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Your account access to the private digital photo and video collection.
        </p>
      </div>

      <div
        className={`rounded-2xl border p-6 md:p-8 ${
          hasAccess
            ? "border-brand-500/30 bg-brand-500/10"
            : "border-white/10 bg-black/30"
        }`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              hasAccess ? "bg-brand-500 text-paper" : "bg-white/10 text-gray-400"
            }`}
          >
            {hasAccess ? (
              <FaCheckCircle aria-hidden="true" />
            ) : (
              <FaLock aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
              {hasAccess ? "Access granted" : "Access not granted"}
            </p>
            <h4 className="mt-2 font-serif text-2xl font-bold text-white">
              {hasAccess
                ? "Private gallery unlocked"
                : "Request or verify gallery access"}
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              {hasAccess
                ? "This account can access the private digital gallery. Backend permissions remain the source of truth for protected media."
                : "Request an access code, then verify it while signed in with the same email address."}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={hasAccess ? "/gallery/digital" : "/gallery-gate?next=/gallery/digital"}
                className="inline-flex justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold text-paper transition-colors hover:bg-brand-700"
              >
                {hasAccess ? "Open Private Gallery" : "Request / Verify Access"}
              </Link>
              {!hasAccess ? (
                <Link
                  href="/gallery/physical"
                  className="inline-flex justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-gray-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  Browse Public Prints
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
