import { loadStripe } from "@stripe/stripe-js";

const stripePublicKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY?.trim() ?? "";

export const isStripeConfigured = stripePublicKey.length > 0;

export const STRIPE_CONFIGURATION_ERROR =
  "Checkout is temporarily unavailable because payment configuration is incomplete. Please try again later.";

export const stripePromise = isStripeConfigured
  ? loadStripe(stripePublicKey)
  : null;
