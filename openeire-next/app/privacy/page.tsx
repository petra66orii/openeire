import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Privacy and Cookie Policy | OpenÉire Studios",
  description:
    "Read the OpenÉire Studios privacy and cookie policy hosted by iubenda.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
