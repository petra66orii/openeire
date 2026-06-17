import Link from "next/link";
import type { Metadata } from "next";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSafeReturnPath } from "@/lib/auth/redirects";

export const metadata: Metadata = buildPageMetadata({
  title: "Verify Your Email",
  description: "Check your inbox to verify your OpenEire Studios account.",
  path: "/verify-pending",
  noIndex: true,
});

export default async function VerificationPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; fromGalleryGate?: string; next?: string }>;
}) {
  const params = await searchParams;
  const email = params.email;
  const isGalleryIntent = params.fromGalleryGate === "1";
  const nextPath = getSafeReturnPath(params.next, isGalleryIntent ? "/gallery-gate" : "/profile");

  return (
    <div className="mobile-page-offset flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-white/10 bg-gray-900 p-8 text-center shadow-2xl">
        <div className="group relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-accent/20 opacity-20" />
          <FaEnvelopeOpenText className="relative z-10 text-4xl text-accent" />
        </div>

        <h1 className="mb-4 font-serif text-3xl font-bold text-white">
          Verify Your Email
        </h1>

        <p className="mb-6 leading-relaxed text-gray-400">
          {isGalleryIntent
            ? "We've sent a secure verification link so you can finish setting up your account and unlock the private gallery."
            : "Thank you for registering. We have sent a secure verification link to your email address. Please click the link to activate your account."}
        </p>

        {email ? (
          <div className="mb-6 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-brand-100">
            Sent to <span className="font-semibold text-white">{email}</span>
          </div>
        ) : null}

        {isGalleryIntent ? (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-brand-100">
            After verifying, sign in with this same email and we&apos;ll take you
            back to the gallery gate to enter your access code.
          </div>
        ) : null}

        <div className="rounded-lg border border-white/5 bg-black/40 p-4 text-xs text-gray-500">
          <p>
            Didn&apos;t receive an email? Check your spam folder or{" "}
            <Link href="/contact" className="font-bold text-accent hover:underline">
              contact support
            </Link>
            .
          </p>
        </div>

        {isGalleryIntent ? (
          <div className="mt-6 text-sm text-gray-400">
            Already verified?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(nextPath)}${
                email ? `&email=${encodeURIComponent(email)}` : ""
              }`}
              className="font-semibold text-white hover:text-accent"
            >
              Sign in and continue
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
