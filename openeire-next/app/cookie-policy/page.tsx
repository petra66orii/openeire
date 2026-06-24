import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Privacy and Cookie Policy | OpenÉire Studios",
    description:
      "Read the OpenÉire Studios privacy and cookie policy hosted by iubenda.",
    path: "/privacy",
    noIndex: true,
  }),
};

export default function CookiePolicyPage() {
  return <PrivacyPolicyContent />;
}
