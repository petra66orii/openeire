"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";

export function PrivateGalleryAccessShell({
  title,
  pendingTitle = "Private gallery content pending migration",
}: {
  title: string;
  pendingTitle?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const hasGalleryAccess = Boolean(user?.can_access_gallery);
  const gateHref = `/gallery-gate?next=${encodeURIComponent(pathname || "/gallery/digital")}`;

  useEffect(() => {
    if (!isLoading && !hasGalleryAccess) {
      router.replace(gateHref);
    }
  }, [gateHref, hasGalleryAccess, isLoading, router]);

  if (isLoading) {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="sr-only">Checking gallery access</span>
      </div>
    );
  }

  if (!hasGalleryAccess) {
    return (
      <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
        <div className="max-w-md rounded-2xl border border-white/10 bg-gray-900/50 p-8 shadow-2xl">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
            Redirecting
          </p>
          <h1 className="mt-3 font-serif text-2xl font-bold">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Taking you to the private collection access flow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 text-center text-white">
      <div className="max-w-2xl rounded-2xl border border-brand-500/25 bg-gray-900/70 p-8 shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-paper">
          <FaCheckCircle aria-hidden="true" />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-accent">
          Access granted
        </p>
        <h1 className="font-serif text-3xl font-bold">{pendingTitle}</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-400">
          Your account is authorised for the private digital gallery. The
          interactive private listing is still being migrated into Next.js, so
          this page no longer asks you to request access again.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/profile"
            className="rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-paper transition-colors hover:bg-brand-900"
          >
            View Account
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
