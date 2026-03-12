import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import VerificationStatusPage from "./pages/VerificationStatusPage";
import VerificationPendingPage from "./pages/VerificationPendingPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import RequestPasswordResetPage from "./pages/RequestPasswordResetPage";
import ConfirmPasswordResetPage from "./pages/ConfirmPasswordResetPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import GalleryPage from "./pages/GalleryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ShoppingBagPage from "./pages/ShoppingBagPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import GalleryGatePage from "./pages/GalleryGatePage";
import GalleryGuard from "./components/GalleryGuard";
import Breadcrumbs from "./components/Breadcrumbs";
import AboutPage from "./pages/AboutPage";
import LicensingPage from "./pages/LicensingPage";
import { BreadcrumbProvider } from "./context/BreadcrumbContext";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import NotFoundPage from "./pages/NotFoundPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import { subscribeToErrorRoute } from "./utils/errorRouting";

function App() {
  const navigate = useNavigate();

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
            {/* Allows access to the main gallery page and physical items without a code */}
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
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/500" element={<ServerErrorPage />} />

            {/* ================= PROTECTED ROUTES ================= */}

            {/* LOCKED GALLERY (Stock Footage / Digital Only) */}
            <Route element={<GalleryGuard />}>
              {/* React Router matches specific paths before dynamic ones. 
                These will trigger the Guard/Gate Page. */}
              <Route path="/gallery/digital" element={<GalleryPage />} />
              <Route path="/gallery/photo" element={<GalleryPage />} />
              <Route path="/gallery/video" element={<GalleryPage />} />

              {/* Detail pages for digital assets */}
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
            <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <BackToTop />
        </main>
        <Footer />
      </BreadcrumbProvider>
    </>
  );
}

export default App;
