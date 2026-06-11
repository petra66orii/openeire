import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { useLocation } from "react-router-dom";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { newsletterSignup } from "../services/api";
import { getNewsletterToastErrorMessage } from "../utils/toast";
import {
  registerIubendaConsentForm,
  submitIubendaConsentForm,
} from "../utils/iubendaConsent";

const DISMISSED_UNTIL_KEY = "openeire:newsletter-modal-dismissed-until";
const SUBSCRIBED_KEY = "openeire:newsletter-modal-subscribed";
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000;
const WELCOME_CODE = "WELCOME10";
const MODAL_FORM_ID = "newsletter-modal-signup-form";
const MODAL_SUBMIT_ID = "newsletter-modal-submit";

const BLOCKED_PATH_PREFIXES = [
  "/bag",
  "/checkout",
  "/checkout-success",
  "/login",
  "/logout",
  "/register",
  "/profile",
  "/request-password-reset",
  "/password-reset/confirm",
  "/verify-pending",
  "/verify-email",
  "/staff/",
  "/gallery-gate",
  "/gallery/digital",
  "/gallery/photo",
  "/gallery/video",
  "/403",
  "/404",
  "/500",
];

const shouldBlockModalForPath = (pathname: string): boolean =>
  BLOCKED_PATH_PREFIXES.some((prefix) => {
    const normalizedPrefix = prefix.endsWith("/")
      ? prefix.slice(0, -1)
      : prefix;
    return (
      pathname === normalizedPrefix ||
      pathname.startsWith(`${normalizedPrefix}/`)
    );
  });

const hasActiveDismissal = (): boolean => {
  if (typeof window === "undefined") return false;
  const dismissedUntil = Number(
    window.localStorage.getItem(DISMISSED_UNTIL_KEY),
  );
  return Number.isFinite(dismissedUntil) && dismissedUntil > Date.now();
};

const hasCompletedSignup = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SUBSCRIBED_KEY) === "1";
};

const NewsletterSignupModal: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEligibleRoute = useMemo(
    () => !shouldBlockModalForPath(location.pathname),
    [location.pathname],
  );

  const closeWithDismissal = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        DISMISSED_UNTIL_KEY,
        String(Date.now() + DISMISS_DURATION_MS),
      );
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen || isSuccess) return;

    return registerIubendaConsentForm({
      formId: MODAL_FORM_ID,
      submitButtonId: MODAL_SUBMIT_ID,
      subject: {
        email: "email",
      },
      preferences: {
        newsletter: "newsletter_consent",
      },
    });
  }, [isOpen, isSuccess]);

  useEffect(() => {
    if (!isEligibleRoute) {
      setIsOpen(false);
      return;
    }

    if (typeof window === "undefined") return;
    if (hasActiveDismissal() || hasCompletedSignup()) return;

    let didTrigger = false;

    const openModal = () => {
      if (didTrigger || hasActiveDismissal() || hasCompletedSignup()) return;
      didTrigger = true;
      setIsOpen(true);
    };

    const timeoutId = window.setTimeout(openModal, 10_000);
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrolledRatio = window.scrollY / scrollableHeight;
      if (scrolledRatio >= 0.4) {
        openModal();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isEligibleRoute, location.key]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeWithDismissal();
      }
    };

    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      window.removeEventListener("keydown", handleKeyDown);
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await newsletterSignup({
        email,
        source: "newsletter_modal",
      });
      submitIubendaConsentForm(MODAL_FORM_ID);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SUBSCRIBED_KEY, "1");
        window.localStorage.removeItem(DISMISSED_UNTIL_KEY);
      }
      setIsSuccess(true);
      setEmail("");
    } catch (error) {
      setErrorMessage(getNewsletterToastErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-signup-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeWithDismissal}
      />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(245,197,24,0.08),_transparent_35%),linear-gradient(180deg,_rgba(17,24,39,0.98),_rgba(5,8,14,0.98))] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          onClick={closeWithDismissal}
          aria-label="Close newsletter signup modal"
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-gray-300 transition-colors hover:border-white/20 hover:text-white"
        >
          <FaTimes />
        </button>

        <div className="px-6 pb-6 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
          {isSuccess ? (
            <div className="space-y-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15 text-brand-500">
                <FaCheckCircle className="text-xl" />
              </div>
              <div className="space-y-3">
                <h2
                  id="newsletter-signup-modal-title"
                  className="font-serif text-3xl font-bold text-white"
                >
                  You're in
                </h2>
                <p className="text-base leading-relaxed text-gray-300">
                  Use code{" "}
                  <span className="font-bold text-white">{WELCOME_CODE}</span>{" "}
                  at checkout for 10% off your first art print.
                </p>
                <p className="text-sm leading-relaxed text-gray-400">
                  If newsletter email delivery is configured, we'll also send
                  the code to your inbox.
                </p>
                <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
                  Applies to art prints only. Does not apply to shipping,
                  digital licences, commercial licences, or custom services.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-white"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                  Collector Access
                </p>
                <h2
                  id="newsletter-signup-modal-title"
                  className="max-w-md font-serif text-3xl font-bold leading-tight text-white sm:text-4xl"
                >
                  Get 10% off your first art print
                </h2>
                <p className="max-w-lg text-sm leading-7 text-gray-300 sm:text-base">
                  Join the OpenÉire list for new aerial print releases,
                  behind-the-scenes stories, and early access to collections.
                </p>
              </div>

              <form
                id={MODAL_FORM_ID}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input
                  type="hidden"
                  name="newsletter_consent"
                  value="true"
                  readOnly
                />
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
                    Email Address
                  </span>
                  <input
                    id="newsletter-modal-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </label>

                {errorMessage && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    id={MODAL_SUBMIT_ID}
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? "Joining..." : "Get my 10% code"}
                  </button>
                  <button
                    type="button"
                    onClick={closeWithDismissal}
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-white/20 hover:text-white sm:w-auto"
                  >
                    Maybe later
                  </button>
                </div>
              </form>

              <p className="text-xs leading-6 text-gray-500">
                Applies to art prints only. Does not apply to shipping, digital
                licences, commercial licences, or custom services.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default NewsletterSignupModal;
