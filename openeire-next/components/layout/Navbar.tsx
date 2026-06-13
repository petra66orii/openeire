import Link from "next/link";

const navItems = [
  { href: "/art-prints", label: "Art Prints" },
  { href: "/licensing", label: "Licensing" },
  { href: "/footage", label: "Footage" },
  { href: "/real-estate", label: "Real Estate" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5"
      >
        <Link href="/" className="font-serif text-xl font-semibold tracking-wide">
          OpenÉire Studios
        </Link>
        <div className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.18em] text-white/75 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
