import type { Metadata } from "next";
import { PasswordResetRequestForm } from "@/components/auth/PasswordResetRequestForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Reset Password",
  description: "Request a password reset for your OpenEire Studios account.",
  path: "/request-password-reset",
  noIndex: true,
});

export default function RequestPasswordResetPage() {
  return (
    <div className="mobile-page-offset flex min-h-screen items-center justify-center bg-black p-4">
      <PasswordResetRequestForm />
    </div>
  );
}
