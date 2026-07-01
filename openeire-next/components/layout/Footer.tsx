import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FooterNewsletterSignup } from "@/components/newsletter/FooterNewsletterSignup";

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="block text-brand-100/80 transition-colors duration-200 hover:translate-x-1 hover:text-accent"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: ReactNode;
}) {
  const sharedClassName =
    "flex h-11 w-11 items-center justify-center rounded-full bg-brand-800 text-lg text-white transition-all duration-300";

  if (!href) {
    return (
      <span
        aria-label={`${label} URL not configured yet`}
        title={`${label} URL not configured yet`}
        className={`${sharedClassName} opacity-70`}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`${sharedClassName} hover:bg-accent hover:text-brand-900`}
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-brand-800 bg-brand-900 pb-10 pt-20 text-brand-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/full-logo-white.png"
                alt="OpenÉire Studios"
                width={380}
                height={200}
                className="h-12 w-auto opacity-90 transition-opacity hover:opacity-100"
              />
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-brand-100/80">
              Capturing the raw beauty of Ireland and beyond. Premium fine art
              prints, commercial licensing, and aerial footage for collectors
              and creators.
            </p>
            <div className="mt-1 flex space-x-4">
              <SocialLink
                href={process.env.NEXT_PUBLIC_SITE_SOCIAL_INSTAGRAM_URL}
                label="Instagram"
              >
                <FaInstagram className="h-6 w-6" aria-hidden="true" />
              </SocialLink>
              <SocialLink
                href={process.env.NEXT_PUBLIC_SITE_SOCIAL_YOUTUBE_URL}
                label="YouTube"
              >
                <FaYoutube className="h-6 w-6" aria-hidden="true" />
              </SocialLink>
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-serif text-lg font-bold text-white">Explore</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/art-prints">Art Prints</FooterLink>
              <FooterLink href="/licensing">Licensing</FooterLink>
              <FooterLink href="/gallery-gate?next=/gallery/digital">Stock Footage</FooterLink>
              <FooterLink href="/services">Services</FooterLink>
              <FooterLink href="/blog">Journal</FooterLink>
              <FooterLink href="/about">Our Story</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-serif text-lg font-bold text-white">Support</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/licensing/terms">Licensing Terms (EULA)</FooterLink>
              <FooterLink href="/terms">Terms & Conditions</FooterLink>
              <FooterLink href="/privacy">Privacy & Cookie Policy</FooterLink>
              <FooterLink href="/shipping">Shipping Policy</FooterLink>
              <FooterLink href="/refunds">Refund & Return Policy</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-white">
              Stay Connected
            </h3>
            <p className="mb-4 text-sm text-brand-100/80">
              Join our community for exclusive discounts and new location drops.
            </p>
            <FooterNewsletterSignup />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-brand-800 pt-8 text-xs text-brand-100/80 md:flex-row">
          <div className="text-center md:text-left">
            <p>
              &copy; {new Date().getFullYear()} OpenÉire Studios. All rights
              reserved.
              <span className="hidden md:inline"> {"\u2022"} </span>
              <span className="mt-1 block md:mt-0 md:inline">
                Designed with {"\u2618\ufe0f"} by{" "}
                <a
                  href="https://missbott.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-100 transition-colors duration-300 hover:text-accent"
                >
                  Miss Bott
                </a>
              </span>
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-[10px] uppercase leading-relaxed tracking-wider text-brand-100/90">
              Art prints are sold for personal display only and do not include
              reproduction rights. Digital media is Rights-Managed and subject
              to strict commercial licensing terms.
              <Link
                href="/licensing/terms"
                className="ml-1 text-white underline hover:text-accent"
              >
                View Licensing Terms
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
