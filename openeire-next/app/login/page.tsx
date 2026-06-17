import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Log In",
  description:
    "Sign in to access your OpenEire Studios account, downloads, and order history.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="mobile-page-offset flex min-h-screen flex-col items-center justify-center bg-black p-4 pt-20">
      <Suspense
        fallback={
          <div className="text-sm uppercase tracking-widest text-gray-500">
            Loading login...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
