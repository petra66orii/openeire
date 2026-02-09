import React, { useState, useEffect } from "react";
import { getProfile, UserProfile } from "../services/api";
import EditProfileForm from "../components/EditProfileForm";
import OrderHistoryList from "../components/OrderHistoryList";
import SecuritySettings from "../components/SecuritySettings";
import LikedPostsList from "../components/LikedPostsList";
import { useAuth } from "../context/AuthContext";

type Tab = "profile" | "security" | "orders" | "likes";

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, refreshUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const getTabClass = (tabName: Tab) =>
    `text-left px-4 py-3 rounded-md transition-colors font-medium flex items-center ${
      activeTab === tabName
        ? "bg-green-50 text-green-700 border-l-4 border-green-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-1/4">
          <nav className="flex flex-col space-y-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab("profile")}
              className={getTabClass("profile")}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile & Shipping
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={getTabClass("security")}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Security
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={getTabClass("orders")}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Order History
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className={getTabClass("likes")}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              My Likes
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="w-full md:w-3/4 bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
          {activeTab === "profile" && (
            <EditProfileForm initialData={user as UserProfile} />
          )}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "orders" && <OrderHistoryList />}
          {activeTab === "likes" && <LikedPostsList />}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
