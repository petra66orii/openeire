import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";

const HomePage = () => <div>Home Page</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />{" "}
    </Routes>
  );
}

export default App;
