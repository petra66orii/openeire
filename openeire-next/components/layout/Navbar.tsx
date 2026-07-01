"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { CartBadge } from "@/components/cart/CartBadge";
import {
  formatFreeShippingThreshold,
  FREE_SHIPPING_PROMO_ENABLED,
} from "@/lib/freeShipping";

const primaryNavItems = [
  { href: "/art-prints", label: "Art Prints" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const serviceNavItems = [
  { href: "/licensing", label: "Commercial Licensing" },
  { href: "/real-estate", label: "Real Estate Services" },
];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

function AuthLinks({
  isAuthenticated,
  isLoading,
  variant,
}: {
  isAuthenticated: boolean;
  isLoading: boolean;
  variant: "desktop" | "mobile";
}) {
  if (isLoading) {
    return variant === "desktop" ? (
      <div
        className="hidden h-9 w-40 rounded-full bg-white/5 lg:block"
        aria-hidden="true"
      />
    ) : (
      <div className="space-y-3 border-t border-white/10 pt-4" aria-hidden="true">
        <div className="h-4 w-24 rounded-full bg-white/5" />
        <div className="h-9 w-full rounded-full bg-white/5" />
      </div>
    );
  }

  const links = isAuthenticated
    ? [
        { href: "/profile", label: "Profile", cta: false },
        { href: "/logout", label: "Logout", cta: false },
      ]
    : [
        { href: "/login", label: "Login", cta: false },
        { href: "/register", label: "Get Started", cta: true },
      ];

  if (variant === "desktop") {
    return (
      <div className="hidden items-center space-x-4 text-sm font-medium lg:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.cta
                ? "rounded-full bg-primary px-5 py-2 text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 hover:bg-primary/90"
                : "transition-colors hover:text-accent-hover"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-white/10 pt-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            link.cta
              ? "block rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold uppercase tracking-wide text-white"
              : "block text-sm font-semibold uppercase tracking-wide transition-colors hover:text-accent-hover"
          }
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isDesktopServicesOpen, setIsDesktopServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const isServicesActive =
    isActivePath(pathname, "/services") ||
    serviceNavItems.some((item) => isActivePath(pathname, item.href));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    setIsDesktopServicesOpen(false);
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
              <span className="ml-1 font-bold text-white">{formatFreeShippingThreshold()}</span>
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
              <Link
                href="/art-prints"
                className="transition-colors hover:text-accent-hover"
                style={
                  isActivePath(pathname, "/art-prints")
                    ? { color: "var(--color-accent)", fontWeight: 600 }
                    : undefined
                }
              >
                Art Prints
              </Link>

              <div
                className="group relative"
                onMouseEnter={() => setIsDesktopServicesOpen(true)}
                onMouseLeave={() => setIsDesktopServicesOpen(false)}
                onFocus={() => setIsDesktopServicesOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setIsDesktopServicesOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 uppercase tracking-wide transition-colors hover:text-accent-hover focus:text-accent-hover focus:outline-none"
                  style={
                    isServicesActive
                      ? { color: "var(--color-accent)", fontWeight: 600 }
                      : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={isDesktopServicesOpen}
                >
                  Services
                  <svg
                    className="h-3 w-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="invisible absolute left-1/2 top-full z-20 mt-4 w-64 -translate-x-1/2 rounded-2xl border border-white/10 bg-dark/95 p-3 text-left opacity-0 shadow-2xl shadow-black/35 backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="absolute -top-4 left-0 h-4 w-full" aria-hidden="true" />
                  {serviceNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 transition-colors hover:bg-white/10 hover:text-accent"
                      style={
                        isActivePath(pathname, item.href)
                          ? { color: "var(--color-accent)" }
                          : undefined
                      }
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {primaryNavItems.slice(1).map((item) => (
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
                <CartBadge />
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

              <AuthLinks
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
                variant="desktop"
              />
            </div>
          </div>

          {isMobileMenuOpen ? (
            <div id="mobile-nav" className="px-4 pb-4 lg:hidden">
              <div className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-dark/95 p-4 shadow-lg backdrop-blur-md">
                <Link
                  href="/art-prints"
                  className="block text-sm font-semibold uppercase tracking-wide transition-colors hover:text-accent-hover"
                >
                  Art Prints
                </Link>
                <div>
                  <button
                    type="button"
                    onClick={() => setIsMobileServicesOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:text-accent-hover"
                    aria-expanded={isMobileServicesOpen}
                    aria-controls="mobile-services-nav"
                  >
                    Services
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        isMobileServicesOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {isMobileServicesOpen ? (
                    <div
                      id="mobile-services-nav"
                      className="mt-3 space-y-3 border-l border-white/10 pl-4"
                    >
                      {serviceNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-accent-hover"
                          style={
                            isActivePath(pathname, item.href)
                              ? { color: "var(--color-accent)" }
                              : undefined
                          }
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                {primaryNavItems.slice(1).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm font-semibold uppercase tracking-wide transition-colors hover:text-accent-hover"
                  >
                    {item.label}
                  </Link>
                ))}
                <AuthLinks
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                  variant="mobile"
                />
              </div>
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
