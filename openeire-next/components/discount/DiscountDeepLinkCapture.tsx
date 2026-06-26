"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { savePendingDiscountCode } from "@/lib/discount/pendingDiscount";

export function DiscountDeepLinkCapture() {
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    savePendingDiscountCode(params.get("discount"));
  }, [pathname]);

  return null;
}
