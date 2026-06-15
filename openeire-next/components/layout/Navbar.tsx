"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const FREE_SHIPPING_PROMO_ENABLED = true;
const FREE_SHIPPING_THRESHOLD = 180;

const navItems = [
  { href: "/art-prints", label: "Art Prints" },
  { href: "/licensing", label: "Licensing" },
  { href: "/footage", label: "Footage" },
  { href: "/real-estate", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

export function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${headerHeight}px`,
      );
    };

    updateHeaderHeight();
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateHeaderHeight)
        : null;

    if (resizeObserver && headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, [showBanner, isMobileMenuOpen, scrolled, pathname]);

  const navBackground =
    isHome && !scrolled
      ? "bg-transparent py-6"
      : "bg-dark/90 py-3 shadow-sm backdrop-blur-md";

  return (
    <div
      ref={headerRef}
      className="fixed left-0 top-0 z-50 flex w-full flex-col transition-all duration-300"
    >
      {showBanner && FREE_SHIPPING_PROMO_ENABLED ? (
        <div className="relative bg-dark px-4 py-2 text-xs font-medium text-white transition-all duration-300 ease-in-out">
          <div className="container mx-auto flex items-center justify-center text-center">
            <p className="tracking-wide">
              <span className="font-bold text-accent">{"\u2728"} Free Delivery</span>
              <span className="ml-1 opacity-90">on all physical orders over </span>
              <span className="ml-1 font-bold text-white">
                {"\u20ac"}
                {FREE_SHIPPING_THRESHOLD}
              </span>
              <Link
                href="/gallery/physical"
                className="ml-3 hidden underline decoration-accent/50 transition-all hover:text-accent hover:decoration-accent md:inline-block"
              >
                Shop Prints &rarr;
              </Link>
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
              aria-label="Close"
              type="button"
            >
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      <nav className={`w-full text-white transition-all duration-300 ${navBackground}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/full-logo-white.png"
                alt="OpenÉire Studios Logo"
                width={380}
                height={200}
                priority
                className="h-[4.15rem] w-auto shrink-0 text-white transition-all lg:h-[4.4rem] xl:h-[4.8rem]"
              />
            </Link>

            <div className="hidden items-center gap-5 font-medium text-xs uppercase tracking-wide lg:flex xl:gap-8 xl:text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-accent-hover"
                  style={
                    isActivePath(pathname, item.href)
                      ? { color: "var(--color-accent)", fontWeight: 600 }
                      : undefined
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/bag"
                className="relative transition-colors hover:text-accent-hover"
                aria-label="Open shopping bag"
                title="Shopping bag"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition-all hover:bg-white/10 lg:hidden"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  {isMobileMenuOpen ? (
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>

              <div className="hidden items-center space-x-4 text-sm font-medium lg:flex">
                <Link href="/login" className="transition-colors hover:text-accent-hover">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-primary px-5 py-2 text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 hover:bg-primary/90"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {isMobileMenuOpen ? (
            <div id="mobile-nav" className="px-4 pb-4 lg:hidden">
              <div className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-dark/95 p-4 shadow-lg backdrop-blur-md">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm font-semibold uppercase tracking-wide transition-colors hover:text-accent-hover"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="space-y-3 border-t border-white/10 pt-4">
                  <Link
                    href="/login"
                    className="block text-sm font-semibold uppercase tracking-wide transition-colors hover:text-accent-hover"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold uppercase tracking-wide text-white"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
