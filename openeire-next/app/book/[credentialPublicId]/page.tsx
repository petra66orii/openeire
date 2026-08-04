import type { Metadata } from "next";
import { ReturningClientBookingForm } from "@/components/real-estate/ReturningClientBookingForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "Private property booking | OpenÉire Studios",
  description: "Secure returning-client property booking.",
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false, noimageindex: true } },
  referrer: "no-referrer", alternates: { canonical: null }, openGraph: null, twitter: null,
};

export default async function BookingPage({ params }: { params: Promise<{ credentialPublicId: string }> }) {
  const { credentialPublicId } = await params;
  if (process.env.REAL_ESTATE_BOOKING_PORTAL_ENABLED !== "true") {
    return <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100"><div className="mx-auto max-w-4xl"><header className="mb-10 border-b border-white/10 pb-6 text-xl font-extrabold">OpenÉire <span className="text-amber-400">Studios</span></header><section className="mx-auto max-w-xl py-20 text-center"><h1 className="text-3xl font-bold">Booking access unavailable</h1><p className="mt-4 leading-7 text-zinc-300">This private service is not currently available.</p></section></div></div>;
  }
  return <ReturningClientBookingForm credentialPublicId={credentialPublicId} />;
}
