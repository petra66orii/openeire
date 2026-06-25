import type { Metadata } from "next";
import Link from "next/link";
import { ErrorPageShell } from "@/components/errors/ErrorPageShell";

export const metadata: Metadata = {
  title: "Something went wrong | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function ServerErrorPage() {
  return <ErrorPageShell statusCode="500" title="Something Went Wrong" message="An unexpected error occurred. Please try again or return to the homepage."><Link href="/" className="inline-flex min-w-45 justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white">Back Home</Link></ErrorPageShell>;
}
