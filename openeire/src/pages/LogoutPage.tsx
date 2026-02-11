import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = () => {
    logout();
    navigate("/login");
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-4">
      <div className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8 text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaSignOutAlt className="text-2xl text-gray-400" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-white mb-2">
          Log Out?
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Are you sure you want to sign out of your account?
        </p>

        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-red-500/10 border border-red-500/50 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all"
          >
            Yes, Log Out
          </button>

          <button
            onClick={handleCancel}
            className="w-full py-3 bg-white/5 text-white font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
