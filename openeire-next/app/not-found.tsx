import Link from "next/link";
import { ErrorPageShell } from "@/components/errors/ErrorPageShell";

export default function NotFound() {
  return (
    <ErrorPageShell statusCode="404" title="Page Not Found" message="The page you requested does not exist or may have been moved.">
      <Link href="/gallery/physical" className="inline-flex min-w-45 justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white">Browse Gallery</Link>
      <Link href="/" className="inline-flex min-w-45 justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10">Back Home</Link>
    </ErrorPageShell>
  );
}
