"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { REAL_ESTATE_PORTFOLIO_PATH } from "@/lib/realEstatePresentation";

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
          page: REAL_ESTATE_PORTFOLIO_PATH,
          location: eventLocation,
          destination: href,
        })
      }
    >
      {children}
    </Link>
  );
}
