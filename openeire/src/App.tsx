// src/App.tsx

import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import VerificationPendingPage from "./pages/VerificationPendingPage";

const HomePage = () => <div>Home Page</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-pending" element={<VerificationPendingPage />} />
    </Routes>
  );
}

export default App;
