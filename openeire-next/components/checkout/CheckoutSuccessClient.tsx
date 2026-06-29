"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaEnvelope,
  FaExclamationCircle,
} from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import {
  clearCheckoutSuccessContext,
  hasTrackedPurchaseAnalytics,
  isCheckoutSuccessHistoryEntry,
  markCheckoutSuccessHistoryEntry,
  markPurchaseAnalyticsTracked,
  readCheckoutSuccessContext,
  stripCheckoutReturnParameters,
  writeCheckoutSuccessContext,
} from "@/lib/checkout/successContext";
import { getCheckoutCartSignature } from "@/lib/checkout/payload";
import { trackEcommerceEvent } from "@/lib/ecommerceAnalytics";
import { stripePromise } from "@/lib/stripe/client";
import type { CheckoutSuccessContext } from "@/types/checkout";

type RedirectStatus =
  | "checking"
  | "succeeded"
  | "processing"
  | "incomplete"
  | "unavailable";

const emptyContext = (paymentIntentId: string): CheckoutSuccessContext => ({
  paymentIntentId,
  cartSignature: "",
  hasDigitalItems: false,
  hasPhysicalItems: false,
  itemCount: 0,
});

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { clearCart, isLoaded: isCartLoaded, items } = useCart();
  const hasClearedCart = useRef(false);
  const trackedPurchaseRef = useRef<string | null>(null);
  const [context, setContext] = useState<CheckoutSuccessContext | null>(null);
  const [displayStatus, setDisplayStatus] =
    useState<RedirectStatus>("checking");

  useEffect(() => {
    const storedContext = readCheckoutSuccessContext();
    const clientSecret = searchParams.get("payment_intent_client_secret") ?? "";
    const paymentIntentId = searchParams.get("payment_intent") ?? "";
    const hasReturnParameters = Boolean(clientSecret || paymentIntentId);

    setContext(storedContext);

    if (!hasReturnParameters) {
      if (
        storedContext?.returnStatus &&
        isCheckoutSuccessHistoryEntry(storedContext.paymentIntentId)
      ) {
        setDisplayStatus(storedContext.returnStatus);
      } else {
        clearCheckoutSuccessContext();
        setContext(null);
        setDisplayStatus("unavailable");
      }
      return;
    }

    stripCheckoutReturnParameters();

    if (!clientSecret || !paymentIntentId) {
      clearCheckoutSuccessContext();
      setDisplayStatus("unavailable");
      return;
    }

    if (
      storedContext?.paymentIntentId &&
      storedContext.paymentIntentId !== paymentIntentId
    ) {
      clearCheckoutSuccessContext();
      setDisplayStatus("unavailable");
      return;
    }

    let isActive = true;
    const verifyPayment = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          clearCheckoutSuccessContext();
          if (isActive) setDisplayStatus("unavailable");
          return;
        }

        const { paymentIntent, error } = await stripe.retrievePaymentIntent(
          clientSecret,
        );
        if (!isActive) return;

        if (error || !paymentIntent || paymentIntent.id !== paymentIntentId) {
          clearCheckoutSuccessContext();
          setDisplayStatus("unavailable");
          return;
        }

        if (paymentIntent.status === "succeeded") {
          const verifiedContext: CheckoutSuccessContext = {
            ...(storedContext ?? emptyContext(paymentIntentId)),
            paymentIntentId,
            returnStatus: "succeeded",
            returnRecordedAt: Date.now(),
          };
          writeCheckoutSuccessContext(verifiedContext);
          markCheckoutSuccessHistoryEntry(paymentIntentId);
          setContext(verifiedContext);
          setDisplayStatus("succeeded");
          return;
        }

        if (paymentIntent.status === "processing") {
          // Processing is deliberately not persisted because it can later fail.
          // A refresh must not present a stale status without rechecking Stripe.
          clearCheckoutSuccessContext();
          setContext(storedContext ?? emptyContext(paymentIntentId));
          setDisplayStatus("processing");
          return;
        }

        clearCheckoutSuccessContext();
        setDisplayStatus("incomplete");
      } catch {
        clearCheckoutSuccessContext();
        if (isActive) setDisplayStatus("unavailable");
      }
    };

    void verifyPayment();
    return () => {
      isActive = false;
    };
  }, [searchParams]);

  useEffect(() => {
    const analytics = context?.analytics;
    if (
      displayStatus !== "succeeded" ||
      !context?.paymentIntentId ||
      trackedPurchaseRef.current === context.paymentIntentId ||
      hasTrackedPurchaseAnalytics(context.paymentIntentId) ||
      !analytics?.items?.length
    ) {
      return;
    }

    trackedPurchaseRef.current = context.paymentIntentId;
    markPurchaseAnalyticsTracked(context.paymentIntentId);
    trackEcommerceEvent("purchase", {
      transaction_id: context.paymentIntentId,
      value: analytics.value,
      shipping: analytics.shipping,
      coupon: analytics.coupon,
      items: analytics.items,
    });
  }, [context, displayStatus]);

  useEffect(() => {
    const cartMatchesReceipt = Boolean(
      context?.cartSignature &&
        context.cartSignature === getCheckoutCartSignature(items),
    );
    if (
      displayStatus === "succeeded" &&
      isCartLoaded &&
      cartMatchesReceipt &&
      !hasClearedCart.current
    ) {
      hasClearedCart.current = true;
      clearCart();
    }
  }, [clearCart, context?.cartSignature, displayStatus, isCartLoaded, items]);

  const content = useMemo(() => {
    if (displayStatus === "checking") {
      return {
        title: "Checking payment status",
        description: "We’re securely checking the result returned by Stripe.",
        icon: FaClock,
        iconClass: "text-accent",
      };
    }

    if (displayStatus === "succeeded") {
      return {
        title: "Thank you — payment submitted",
        description:
          "We’re finalising your order now. Your confirmation email will arrive once backend processing is complete.",
        icon: FaCheckCircle,
        iconClass: "text-brand-400",
      };
    }

    if (displayStatus === "processing") {
      return {
        title: "Payment processing",
        description:
          "Stripe is still confirming the payment. Please wait for your confirmation email before submitting the order again.",
        icon: FaClock,
        iconClass: "text-accent",
      };
    }

    if (displayStatus === "incomplete") {
      return {
        title: "Payment not completed",
        description:
          "Stripe did not return a successful payment status. Your bag remains available so you can review checkout and try again.",
        icon: FaExclamationCircle,
        iconClass: "text-red-300",
      };
    }

    return {
      title: "No payment status available",
      description:
        "We cannot verify a recent payment from this page. If you completed checkout, use your confirmation email or account order history as the source of truth.",
      icon: FaExclamationCircle,
      iconClass: "text-gray-400",
    };
  }, [displayStatus]);

  const isReturnedPayment =
    displayStatus === "succeeded" || displayStatus === "processing";
  const StatusIcon = content.icon;
  const showAccountLink =
    isReturnedPayment && !isAuthLoading && isAuthenticated;
  const primaryHref = showAccountLink
    ? "/profile"
    : displayStatus === "incomplete" || displayStatus === "unavailable"
      ? "/checkout"
      : "/gallery/physical";
  const primaryLabel = showAccountLink
    ? "View Account & Orders"
    : displayStatus === "incomplete" || displayStatus === "unavailable"
      ? "Return to Checkout"
      : "Continue Browsing";

  return (
    <main
      className="flex min-h-screen items-start justify-center bg-black px-4 pb-24 text-white"
      style={{
        paddingTop: "calc(var(--site-header-height, 0px) + 2rem)",
      }}
    >
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

        {isReturnedPayment ? (
          <div className="mt-8 grid gap-4 text-left">
            <div className="rounded-xl border border-white/10 bg-black/40 p-5">
              <div className="flex items-center gap-3 text-white">
                <FaEnvelope className="text-accent" aria-hidden="true" />
                <h2 className="font-bold">Confirmation email</h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Your receipt and order confirmation are sent after the secure
                backend webhook finishes processing.
              </p>
            </div>

            {context?.hasDigitalItems ? (
              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <div className="flex items-center gap-3 text-white">
                  <FaDownload className="text-brand-400" aria-hidden="true" />
                  <h2 className="font-bold">Digital delivery</h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Personal-use download and licence links will be delivered by
                  email and through your account where available after the order
                  is created.
                </p>
              </div>
            ) : null}

            {context?.hasPhysicalItems ? (
              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <div className="flex items-center gap-3 text-white">
                  <FaBoxOpen className="text-blue-400" aria-hidden="true" />
                  <h2 className="font-bold">Print fulfilment</h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Physical prints move to production only after backend order
                  confirmation. Tracking details will follow by email.
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {isReturnedPayment && !isAuthLoading ? (
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-gray-400">
            {isAuthenticated
              ? "Orders, downloads, and licences may take a moment to appear in your account while processing completes."
              : "As a guest, your confirmation and fulfilment updates will be sent to the email used at checkout."}
          </p>
        ) : null}

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="rounded-xl bg-brand-500 px-7 py-4 font-bold text-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/15 px-7 py-4 font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Return Home
          </Link>
        </div>

        {isReturnedPayment ? (
          <p className="mt-7 text-sm text-gray-500">
            No confirmation email after 15 minutes?{" "}
            <Link
              href="/contact"
              className="text-accent underline underline-offset-4 hover:text-white"
            >
              Contact support
            </Link>
            .
          </p>
        ) : null}
      </section>
    </main>
  );
}
