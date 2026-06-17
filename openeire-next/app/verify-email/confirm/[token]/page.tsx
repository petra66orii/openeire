import type { Metadata } from "next";
import { VerifyEmailClient } from "@/components/auth/VerifyEmailClient";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Email Verification",
  description: "Confirm your OpenEire Studios email verification link.",
  path: "/verify-email/confirm",
  noIndex: true,
});

export default async function VerificationStatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="mobile-page-offset flex min-h-screen items-center justify-center bg-black p-4">
      <VerifyEmailClient token={token} />
    </div>
  );
}
