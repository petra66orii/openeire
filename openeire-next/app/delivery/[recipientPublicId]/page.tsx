import type { Metadata } from "next";
import { PrivateDeliveryClient } from "@/components/delivery/PrivateDeliveryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Private media delivery | OpenÉire Studios",
  description: "Secure private media delivery.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default async function PrivateDeliveryPage({
  params,
}: {
  params: Promise<{ recipientPublicId: string }>;
}) {
  const { recipientPublicId } = await params;
  return <PrivateDeliveryClient recipientPublicId={recipientPublicId} />;
}
