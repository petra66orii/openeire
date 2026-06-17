import type { Metadata } from "next";
import { PasswordResetConfirmForm } from "@/components/auth/PasswordResetConfirmForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Choose New Password",
  description: "Set a new password for your OpenEire Studios account.",
  path: "/password-reset/confirm",
  noIndex: true,
});

export default async function ConfirmPasswordResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="mobile-page-offset flex min-h-screen items-center justify-center bg-black p-4">
      <PasswordResetConfirmForm token={token} />
    </div>
  );
}
