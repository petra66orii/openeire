import Link from "next/link";

const footerLinks = [
  { href: "/art-prints", label: "Art Prints" },
  { href: "/licensing", label: "Licensing" },
  { href: "/footage", label: "Footage" },
  { href: "/real-estate", label: "Real Estate" },
  { href: "/blog", label: "Blog" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-emerald-950 px-6 py-10 text-sm text-white/75">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-lg font-semibold text-white">OpenÉire Studios</p>
          <p className="mt-2 max-w-lg">
            Premium aerial photography, fine art prints, commercial licensing,
            and curated visual assets from Ireland.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
