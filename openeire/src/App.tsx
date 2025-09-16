import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import VerificationStatusPage from "./pages/VerificationStatusPage";

const HomePage = () => <div>Home Page</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/verify-email/confirm/:token"
        element={<VerificationStatusPage />}
      />
    </Routes>
  );
}

export default App;
