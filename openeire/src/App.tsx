import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import VerificationStatusPage from "./pages/VerificationStatusPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import RequestPasswordResetPage from "./pages/RequestPasswordResetPage";
import ConfirmPasswordResetPage from "./pages/ConfirmPasswordResetPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import GalleryPage from "./pages/GalleryPage";

const HomePage = () => <div>Home Page</div>;

function App() {
  return (
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
  );
}

export default App;
