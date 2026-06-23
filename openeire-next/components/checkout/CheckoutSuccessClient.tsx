"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";
import { useCart } from "@/components/cart/CartProvider";
import {
  clearCheckoutSuccessContext,
  readCheckoutSuccessContext,
} from "@/lib/checkout/successContext";
import { stripePromise } from "@/lib/stripe/client";
import type { CheckoutSuccessContext } from "@/types/checkout";

type RedirectStatus = "succeeded" | "processing" | "incomplete";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const { clearCart, isLoaded: isCartLoaded } = useCart();
  const [context, setContext] = useState<CheckoutSuccessContext | null>(null);
  const [displayStatus, setDisplayStatus] =
    useState<RedirectStatus>("processing");

  useEffect(() => {
    const storedContext = readCheckoutSuccessContext();
    setContext(storedContext);
    const clientSecret = searchParams.get("payment_intent_client_secret") ?? "";
    const paymentIntentId = searchParams.get("payment_intent") ?? "";
    window.history.replaceState(window.history.state, "", "/checkout-success");

    let isActive = true;
    const verifyPayment = async () => {
      if (!clientSecret || !paymentIntentId || !stripePromise) {
        clearCheckoutSuccessContext();
        if (isActive) setDisplayStatus("incomplete");
        return;
      }
      if (
        storedContext?.paymentIntentId &&
        storedContext.paymentIntentId !== paymentIntentId
      ) {
        clearCheckoutSuccessContext();
        if (isActive) setDisplayStatus("incomplete");
        return;
      }

      try {
        const stripe = await stripePromise;
        if (!stripe) {
          if (isActive) setDisplayStatus("processing");
          return;
        }
        const { paymentIntent, error } = await stripe.retrievePaymentIntent(
          clientSecret,
        );
        if (!isActive) return;
        if (error || !paymentIntent || paymentIntent.id !== paymentIntentId) {
          setDisplayStatus("processing");
        } else if (paymentIntent.status === "succeeded") {
          setDisplayStatus("succeeded");
        } else if (paymentIntent.status === "processing") {
          setDisplayStatus("processing");
        } else {
          setDisplayStatus("incomplete");
        }
      } catch {
        if (isActive) setDisplayStatus("processing");
      } finally {
        clearCheckoutSuccessContext();
      }
    };

    void verifyPayment();
    return () => {
      isActive = false;
    };
  }, [searchParams]);

  useEffect(() => {
    if (displayStatus === "succeeded" && isCartLoaded) clearCart();
  }, [clearCart, displayStatus, isCartLoaded]);

  const content = useMemo(() => {
    if (displayStatus === "succeeded") {
      return {
        title: "Payment received",
        description:
          "Stripe accepted your payment. Our secure webhook is now confirming your order; your confirmation email and account order history are the source of truth.",
        icon: FaCheckCircle,
        iconClass: "text-brand-400",
      };
    }

    if (displayStatus === "processing") {
      return {
        title: "Payment processing",
        description:
          "Stripe is still processing your payment. Keep your bag unchanged and wait for the confirmation email before trying again.",
        icon: FaClock,
        iconClass: "text-accent",
      };
    }

    return {
      title: "Payment not completed",
      description:
        "We have not received a successful Stripe result. Your bag is still available so you can review the checkout and try again safely.",
      icon: FaExclamationCircle,
      iconClass: "text-red-300",
    };
  }, [displayStatus]);

  const StatusIcon = content.icon;

  return (
    <main className="page-top-offset flex min-h-screen items-center justify-center bg-black px-4 pb-24 pt-16 text-white md:pt-20">
      <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gray-900 p-8 text-center shadow-2xl md:p-12">
        <StatusIcon
          className={`mx-auto mb-7 h-16 w-16 ${content.iconClass}`}
          aria-hidden="true"
        />
        <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
          {content.description}
        </p>

        {displayStatus === "succeeded" && context ? (
          <div className="mx-auto mt-7 max-w-lg rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300">
            {context.hasDigitalItems && context.hasPhysicalItems
              ? "Your digital delivery and physical fulfilment will appear after backend confirmation."
              : context.hasDigitalItems
                ? "Your secure digital delivery will appear after backend confirmation."
                : "Your physical fulfilment will begin after backend confirmation."}
          </div>
        ) : null}

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={displayStatus === "incomplete" ? "/checkout" : "/profile"}
            className="rounded-xl bg-brand-500 px-7 py-4 font-bold text-black transition-colors hover:bg-white"
          >
            {displayStatus === "incomplete"
              ? "Return to Checkout"
              : "View Account"}
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/15 px-7 py-4 font-bold text-white transition-colors hover:bg-white/10"
          >
            Return Home
          </Link>
        </div>
      </section>
    </main>
  );
}
