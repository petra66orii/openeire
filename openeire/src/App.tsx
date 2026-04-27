import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// ================= SYNC IMPORTS =================
// These load immediately. Critical for layout, routing logic, and the initial Home page.
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import Breadcrumbs from "./components/Breadcrumbs";
import ScrollToTop from "./components/ScrollToTop";
import AnalyticsListener from "./components/AnalyticsListener";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffRoute from "./components/StaffRoute";
import GalleryGuard from "./components/GalleryGuard";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import { BreadcrumbProvider } from "./context/BreadcrumbContext";
import { Toaster } from "react-hot-toast";
import { subscribeToErrorRoute } from "./utils/errorRouting";
import {
  bootstrapIubendaConsentDatabase,
  registerIubendaConsentGrantedCallback,
  shouldDeferGAUntilIubendaConsent,
} from "./utils/iubendaConsent";
import { initGA } from "./lib/analytics";

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
const ArtPrintsPage = lazy(() => import("./pages/ArtPrintsPage"));
const FAQIndexPage = lazy(() => import("./pages/FAQIndexPage"));
const DroneFootageLicensingFAQPage = lazy(
  () => import("./pages/DroneFootageLicensingFAQPage"),
);
const DroneFootageUsageFAQPage = lazy(
  () => import("./pages/DroneFootageUsageFAQPage"),
);
const ArtPrintsFAQPage = lazy(() => import("./pages/ArtPrintsFAQPage"));
const FootageLandingPage = lazy(() => import("./pages/FootageLandingPage"));
const USWallArtPrintsPage = lazy(() => import("./pages/USWallArtPrintsPage"));
const USAerialPhotographyPrintsPage = lazy(
  () => import("./pages/USAerialPhotographyPrintsPage"),
);
const USLandscapeWallArtPage = lazy(
  () => import("./pages/USLandscapeWallArtPage"),
);
const USLargeWallArtPage = lazy(() => import("./pages/USLargeWallArtPage"));
const USWallArtForLivingRoomPage = lazy(
  () => import("./pages/USWallArtForLivingRoomPage"),
);
const USWallArtForOfficePage = lazy(
  () => import("./pages/USWallArtForOfficePage"),
);
const USFineArtPrintsPage = lazy(() => import("./pages/USFineArtPrintsPage"));
const LicensingOverviewPage = lazy(
  () => import("./pages/LicensingOverviewPage"),
);
const LicensingTermsPage = lazy(() => import("./pages/LicensingPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ForbiddenPage = lazy(() => import("./pages/ForbiddenPage"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const StaffVideoUploadsPage = lazy(() => import("./pages/StaffVideoUploadsPage"));

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    bootstrapIubendaConsentDatabase();
  }, []);

  useEffect(() => {
    const shouldDefer = shouldDeferGAUntilIubendaConsent();
    const unsubscribe = shouldDefer
      ? registerIubendaConsentGrantedCallback(() => {
          void initGA();
        })
      : () => undefined;

    if (!shouldDefer) {
      void initGA();
    }

    return unsubscribe;
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
        <AnalyticsListener />
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
              <Route path="/faq" element={<FAQIndexPage />} />
              <Route
                path="/faq/drone-footage-licensing"
                element={<DroneFootageLicensingFAQPage />}
              />
              <Route
                path="/faq/drone-footage-usage"
                element={<DroneFootageUsageFAQPage />}
              />
              <Route path="/faq/art-prints" element={<ArtPrintsFAQPage />} />
              <Route path="/art-prints" element={<ArtPrintsPage />} />
              <Route path="/footage" element={<FootageLandingPage />} />
              <Route
                path="/us/fine-art-prints"
                element={<USFineArtPrintsPage />}
              />
              <Route
                path="/us/wall-art-prints"
                element={<USWallArtPrintsPage />}
              />
              <Route
                path="/us/aerial-photography-prints"
                element={<USAerialPhotographyPrintsPage />}
              />
              <Route
                path="/us/landscape-wall-art"
                element={<USLandscapeWallArtPage />}
              />
              <Route path="/us/large-wall-art" element={<USLargeWallArtPage />} />
              <Route
                path="/us/wall-art-for-living-room"
                element={<USWallArtForLivingRoomPage />}
              />
              <Route
                path="/us/wall-art-for-office"
                element={<USWallArtForOfficePage />}
              />
              <Route path="/gallery/physical" element={<GalleryPage />} />
              <Route
                path="/gallery/physical/:id"
                element={<ProductDetailPage />}
              />

              {/* ... other public pages (Blog, Contact, etc.) ... */}
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/licensing" element={<LicensingOverviewPage />} />
              <Route path="/licensing/terms" element={<LicensingTermsPage />} />
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
              <Route
                path="/staff/uploads/videos"
                element={
                  <StaffRoute>
                    <StaffVideoUploadsPage />
                  </StaffRoute>
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
