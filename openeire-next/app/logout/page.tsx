import type { Metadata } from "next";
import { LogoutConfirm } from "@/components/auth/LogoutConfirm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Log Out",
  description: "Log out of your OpenEire Studios account.",
  path: "/logout",
  noIndex: true,
});

export default function LogoutPage() {
  return (
    <div className="mobile-page-offset flex min-h-screen flex-col items-center justify-center bg-black p-4 pt-20">
      <LogoutConfirm />
    </div>
  );
}
