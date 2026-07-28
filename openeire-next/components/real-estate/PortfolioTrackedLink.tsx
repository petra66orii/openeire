"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type PortfolioTrackedLinkProps = {
  href: string;
  eventName: "portfolio_enquiry_cta" | "portfolio_service_cta";
  eventLocation: string;
  className: string;
  children: ReactNode;
};

export function PortfolioTrackedLink({
  href,
  eventName,
  eventLocation,
  className,
  children,
}: PortfolioTrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent(eventName, {
          page: "/real-estate/portfolio",
          location: eventLocation,
          destination: href,
        })
      }
    >
      {children}
    </Link>
  );
}

