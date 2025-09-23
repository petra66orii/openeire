import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import VerificationStatusPage from "./pages/VerificationStatusPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import RequestPasswordResetPage from "./pages/RequestPasswordResetPage";
import ConfirmPasswordResetPage from "./pages/ConfirmPasswordResetPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import GalleryPage from "./pages/GalleryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShoppingBagPage from "./pages/ShoppingBagPage";

const HomePage = () => <div>Home Page</div>;

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        aria-label={undefined}
      />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
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
            path="/verify-email/confirm/:token"
            element={<VerificationStatusPage />}
          />
          <Route path="/gallery/:type" element={<GalleryPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:type/:id" element={<ProductDetailPage />} />
          <Route path="/bag" element={<ShoppingBagPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
