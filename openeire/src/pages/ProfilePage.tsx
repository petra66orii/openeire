import React, { useState, useEffect } from "react";
import { UserProfile } from "../services/api";
import EditProfileForm from "../components/EditProfileForm";
import OrderHistoryList from "../components/OrderHistoryList";
import SecuritySettings from "../components/SecuritySettings";
import LikedPostsList from "../components/LikedPostsList";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaShieldAlt, FaHistory, FaHeart } from "react-icons/fa";

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
      <div className="bg-black min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) return null;

  const getTabClass = (tabName: Tab) =>
    `text-left px-6 py-4 rounded-xl transition-all font-medium flex items-center gap-4 ${
      activeTab === tabName
        ? "bg-brand-500 text-paper shadow-lg font-bold transform scale-[1.02]"
        : "text-gray-400 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-serif font-bold text-white mb-2">
            My Account
          </h1>
          <p className="text-gray-400">
            Manage your profile, orders, and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full lg:w-1/4">
            <nav className="flex flex-col space-y-2 bg-gray-900 p-4 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab("profile")}
                className={getTabClass("profile")}
              >
                <FaUser /> Profile & Shipping
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={getTabClass("orders")}
              >
                <FaHistory /> Order History
              </button>

              <button
                onClick={() => setActiveTab("likes")}
                className={getTabClass("likes")}
              >
                <FaHeart /> Saved Items
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={getTabClass("security")}
              >
                <FaShieldAlt /> Security
              </button>
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="w-full lg:w-3/4 bg-gray-900 p-8 md:p-10 rounded-3xl border border-white/10 min-h-[600px] shadow-2xl relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
              {activeTab === "profile" && (
                <EditProfileForm initialData={user as UserProfile} />
              )}
              {activeTab === "security" && <SecuritySettings />}
              {activeTab === "orders" && <OrderHistoryList />}
              {activeTab === "likes" && <LikedPostsList />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
