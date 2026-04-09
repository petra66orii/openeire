import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// ================= SYNC IMPORTS =================
// These load immediately. Critical for layout, routing logic, and the initial Home page.
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import Breadcrumbs from "./components/Breadcrumbs";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import GalleryGuard from "./components/GalleryGuard";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import { BreadcrumbProvider } from "./context/BreadcrumbContext";
import { Toaster } from "react-hot-toast";
import { subscribeToErrorRoute } from "./utils/errorRouting";
import { bootstrapIubendaConsentDatabase } from "./utils/iubendaConsent";

// ================= LAZY IMPORTS =================
// These are split into separate JS chunks by Vite and downloaded only when needed.
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const VerificationStatusPage = lazy(
  () => import("./pages/VerificationStatusPage"),
);
const VerificationPendingPage = lazy(
  () => import("./pages/VerificationPendingPage"),
);
const LoginPage = lazy(() => import("./pages/LoginPage"));
const LogoutPage = lazy(() => import("./pages/LogoutPage"));
const RequestPasswordResetPage = lazy(
  () => import("./pages/RequestPasswordResetPage"),
);
const ConfirmPasswordResetPage = lazy(
  () => import("./pages/ConfirmPasswordResetPage"),
);
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ShoppingBagPage = lazy(() => import("./pages/ShoppingBagPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CheckoutSuccessPage = lazy(() => import("./pages/CheckoutSuccessPage"));
const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const GalleryGatePage = lazy(() => import("./pages/GalleryGatePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LicensingPage = lazy(() => import("./pages/LicensingPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ForbiddenPage = lazy(() => import("./pages/ForbiddenPage"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    bootstrapIubendaConsentDatabase();
  }, []);

  useEffect(() => {
    return subscribeToErrorRoute((path) => {
      if (window.location.pathname === path) return;
      navigate(path, { replace: true });
    });
  }, [navigate]);

  return (
    <>
      <BreadcrumbProvider>
        <ScrollToTop />
        <Navbar />
        <Breadcrumbs />
        <main className="flex-grow">
          <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />

          {/* ================= SUSPENSE BOUNDARY ================= */}
          {/* While Vite downloads a lazy-loaded page, this fallback UI is shown */}
          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-pulse text-gray-500 font-medium tracking-widest uppercase">
                  Loading...
                </div>
              </div>
            }
          >
            <Routes>
              {/* ================= PUBLIC ROUTES ================= */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route
                path="/request-password-reset"
                element={<RequestPasswordResetPage />}
              />
              <Route
                path="/password-reset/confirm/:token"
                element={<ConfirmPasswordResetPage />}
              />
              <Route
                path="/verify-pending"
                element={<VerificationPendingPage />}
              />
              <Route
                path="/verify-email/confirm/:token"
                element={<VerificationStatusPage />}
              />

              <Route path="/gallery-gate" element={<GalleryGatePage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* PUBLIC GALLERY (Physical Products & General View) */}
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/gallery/physical" element={<GalleryPage />} />
              <Route
                path="/gallery/physical/:id"
                element={<ProductDetailPage />}
              />

              {/* ... other public pages (Blog, Contact, etc.) ... */}
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/licensing" element={<LicensingPage />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/refunds" element={<RefundPolicy />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<PrivacyPolicy />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/403" element={<ForbiddenPage />} />
              <Route path="/500" element={<ServerErrorPage />} />

              {/* ================= PROTECTED ROUTES ================= */}

              {/* LOCKED GALLERY (Stock Footage / Digital Only) */}
              <Route element={<GalleryGuard />}>
                <Route path="/gallery/digital" element={<GalleryPage />} />
                <Route path="/gallery/photo" element={<GalleryPage />} />
                <Route path="/gallery/video" element={<GalleryPage />} />
                <Route
                  path="/gallery/photo/:id"
                  element={<ProductDetailPage />}
                />
                <Route
                  path="/gallery/video/:id"
                  element={<ProductDetailPage />}
                />
              </Route>

              {/* USER PROFILE (Requires Login) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* CART & CHECKOUT */}
              <Route path="/bag" element={<ShoppingBagPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/checkout-success"
                element={<CheckoutSuccessPage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <BackToTop />
        <Footer />
      </BreadcrumbProvider>
    </>
  );
}

export default App;
