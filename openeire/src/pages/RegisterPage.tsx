import { Link, useLocation } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import SocialLogin from "../components/SocialLogin";
import SEOHead from "../components/SEOHead";
import { getRequestedGalleryEmail } from "../utils/galleryAccessFlow";

type RegisterLocationState =
  | {
      from?: { pathname?: string };
      prefillEmail?: string;
      fromGalleryGate?: boolean;
    }
  | undefined;

const RegisterPage = () => {
  const location = useLocation();
  const locationState = location.state as RegisterLocationState;
  const galleryIntentEmail =
    locationState?.prefillEmail || getRequestedGalleryEmail();
  const redirectPath =
    locationState?.from?.pathname ||
    (galleryIntentEmail ? "/gallery-gate" : "/profile");
  const isGalleryIntent = redirectPath === "/gallery-gate";

  return (
    <div className="mobile-page-offset flex min-h-screen flex-col items-center justify-center bg-black p-4 pt-20">
      <SEOHead
        title="Create Account"
        description="Create an OpenÉire Studios account to manage orders, downloads, and gallery access."
        canonicalPath="/register"
        noindex
      />
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl animate-fade-in-up">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-serif font-bold text-white">
            Create Account
          </h1>
          <p className="text-sm text-gray-400">
            {isGalleryIntent
              ? "Create your account with the same email you used to request gallery access."
              : 'Join Open\u00C9ire Studios to access exclusive content.'}
          </p>
        </div>

        {isGalleryIntent && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-brand-100">
            <p className="font-semibold text-white">Private gallery access</p>
            <p className="mt-2">
              Use the same email where your access code was delivered. After
              you verify your account email, you can sign in and unlock the
              gallery.
            </p>
          </div>
        )}

        <AuthForm
          initialEmail={galleryIntentEmail}
          redirectPath={redirectPath}
        />
        <SocialLogin redirectPath={redirectPath} />

        <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            state={{
              from: { pathname: redirectPath },
              prefillEmail: galleryIntentEmail || undefined,
              fromGalleryGate: isGalleryIntent,
            }}
            className="font-bold text-white transition-colors hover:text-accent"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
