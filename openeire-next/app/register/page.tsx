import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Account",
  description:
    "Create an OpenEire Studios account to manage orders, downloads, and gallery access.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="mobile-page-offset flex min-h-screen flex-col items-center justify-center bg-black p-4 pt-20">
      <Suspense
        fallback={
          <div className="text-sm uppercase tracking-widest text-gray-500">
            Loading registration...
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
