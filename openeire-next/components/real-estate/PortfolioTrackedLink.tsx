"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { getPrintSource, printParameters, withPrintAttribution } from "@/lib/printAttribution";
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
  const [destination, setDestination] = useState(href);
  useEffect(() => {
    setDestination(withPrintAttribution(href, window.location.search));
  }, [href]);

  return (
    <Link
      href={destination}
      className={className}
      onClick={() => {
        const source = getPrintSource(window.location.search);
        trackEvent(eventName, {
          page: REAL_ESTATE_PORTFOLIO_PATH,
          location: eventLocation,
          destination,
          ...(source ? printParameters(source) : {}),
        });
      }}
    >
      {children}
    </Link>
  );
}
