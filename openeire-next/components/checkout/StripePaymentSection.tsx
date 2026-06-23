"use client";

import { Elements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { useMemo } from "react";
import { StripePaymentForm } from "@/components/checkout/StripePaymentForm";
import { stripePromise } from "@/lib/stripe/client";
import type {
  CheckoutFormState,
  CheckoutSuccessContext,
} from "@/types/checkout";

interface StripePaymentSectionProps {
  clientSecret: string;
  formState: CheckoutFormState;
  hasPhysicalItems: boolean;
  isIntentCurrent: boolean;
  isCheckoutBusy: boolean;
  successContext: CheckoutSuccessContext;
}

export function StripePaymentSection({
  clientSecret,
  formState,
  hasPhysicalItems,
  isIntentCurrent,
  isCheckoutBusy,
  successContext,
}: StripePaymentSectionProps) {
  const options = useMemo<StripeElementsOptions>(
    () => ({
      clientSecret,
      appearance: {
        theme: "night",
        variables: {
          colorPrimary: "#16a34a",
          colorBackground: "#1a1a1a",
          colorText: "#ffffff",
          colorDanger: "#ef4444",
          fontFamily: "sans-serif",
          borderRadius: "12px",
        },
      },
    }),
    [clientSecret],
  );

  if (!stripePromise) return null;

  return (
    <Elements key={clientSecret} stripe={stripePromise} options={options}>
      <StripePaymentForm
        formState={formState}
        hasPhysicalItems={hasPhysicalItems}
        isIntentCurrent={isIntentCurrent}
        isCheckoutBusy={isCheckoutBusy}
        successContext={successContext}
      />
    </Elements>
  );
}
