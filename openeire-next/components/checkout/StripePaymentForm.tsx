"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type {
  ConfirmPaymentData,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { FaCreditCard } from "react-icons/fa";
import {
  clearCheckoutSuccessContext,
  writeCheckoutSuccessContext,
} from "@/lib/checkout/successContext";
import type {
  CheckoutFormState,
  CheckoutSuccessContext,
} from "@/types/checkout";

interface StripePaymentFormProps {
  formState: CheckoutFormState;
  hasPhysicalItems: boolean;
  isIntentCurrent: boolean;
  isCheckoutBusy: boolean;
  successContext: CheckoutSuccessContext;
}

const optionalValue = (value: string): string | undefined =>
  value.trim() || undefined;

const getSafeStripeMessage = (value: string | undefined): string => {
  const normalized = value?.trim() ?? "";
  if (!normalized || normalized.length > 300 || /<[^>]+>/.test(normalized)) {
    return "Payment could not be completed. Please review your payment details and try again.";
  }
  return normalized;
};

export function StripePaymentForm({
  formState,
  hasPhysicalItems,
  isIntentCurrent,
  isCheckoutBusy,
  successContext,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isElementReady, setIsElementReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const paymentElementOptions = useMemo<StripePaymentElementOptions>(
    () => ({
      defaultValues: {
        billingDetails: {
          name: optionalValue(formState.contact.name),
          email: optionalValue(formState.contact.email),
          phone: optionalValue(formState.contact.phone),
          ...(hasPhysicalItems
            ? {
                address: {
                  line1: optionalValue(formState.shipping.line1),
                  line2: optionalValue(formState.shipping.line2),
                  city: optionalValue(formState.shipping.city),
                  state: optionalValue(formState.shipping.state),
                  country: optionalValue(formState.shipping.country),
                  postal_code: optionalValue(formState.shipping.postal_code),
                },
              }
            : {}),
        },
      },
      fields: {
        billingDetails: {
          name: "auto",
          email: "never",
          phone: "never",
          address: hasPhysicalItems ? "if_required" : "auto",
        },
      },
      wallets: {
        applePay: "auto",
        googlePay: "auto",
        link: "auto",
      },
    }),
    [formState, hasPhysicalItems],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (processingRef.current || isProcessing || isCheckoutBusy) return;

    if (!isIntentCurrent) {
      setErrorMessage(
        "Your checkout details changed. Review them and prepare payment again.",
      );
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage("Secure payment options are still loading.");
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    setErrorMessage(null);

    const confirmParams: ConfirmPaymentData = {
      return_url: `${window.location.origin}/checkout-success`,
      receipt_email: formState.contact.email.trim(),
      payment_method_data: {
        billing_details: {
          name: optionalValue(formState.contact.name),
          email: optionalValue(formState.contact.email),
          phone: optionalValue(formState.contact.phone),
          ...(hasPhysicalItems
            ? {
                address: {
                  line1: optionalValue(formState.shipping.line1),
                  line2: optionalValue(formState.shipping.line2),
                  city: optionalValue(formState.shipping.city),
                  state: optionalValue(formState.shipping.state),
                  country: optionalValue(formState.shipping.country),
                  postal_code: optionalValue(formState.shipping.postal_code),
                },
              }
            : {}),
        },
      },
    };

    try {
      writeCheckoutSuccessContext(successContext);
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams,
      });

      if (error) {
        clearCheckoutSuccessContext();
        setErrorMessage(getSafeStripeMessage(error.message));
      }
    } catch {
      clearCheckoutSuccessContext();
      setErrorMessage(
        "Payment could not be completed because of a network error. Please try again.",
      );
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-gray-900 p-6 md:p-8"
    >
      <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
        <FaCreditCard className="text-accent" aria-hidden="true" />
        <h2 className="font-serif text-xl font-bold text-white">Payment</h2>
      </div>

      <PaymentElement
        options={paymentElementOptions}
        onReady={() => setIsElementReady(true)}
        onLoadError={(event) =>
          setErrorMessage(getSafeStripeMessage(event.error.message))
        }
      />

      {!isIntentCurrent ? (
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
          Checkout details changed. Review them and prepare payment again.
        </div>
      ) : null}

      {errorMessage ? (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-300"
        >
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={
          !stripe ||
          !elements ||
          !isElementReady ||
          !isIntentCurrent ||
          isCheckoutBusy ||
          isProcessing
        }
        className="mt-8 w-full rounded-xl bg-brand-500 px-8 py-4 font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Complete Order"}
      </button>
    </form>
  );
}
