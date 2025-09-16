import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import VerificationStatusPage from "./pages/VerificationStatusPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";

const HomePage = () => <div>Home Page</div>;
const ProfilePage = () => <div>Welcome to your profile!</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route
        path="/verify-email/confirm/:token"
        element={<VerificationStatusPage />}
      />
    </Routes>
  );
}

export default App;
