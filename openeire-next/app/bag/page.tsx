import type { Metadata } from "next";
import { ShoppingBagClient } from "@/components/cart/ShoppingBagClient";

export const metadata: Metadata = {
  title: "Shopping Bag | OpenÉire Studios",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BagPage() {
  return <ShoppingBagClient />;
}
