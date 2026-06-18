"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaHistory,
  FaIdBadge,
  FaImages,
  FaKey,
  FaShieldAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { AccountSecurityPanel } from "@/components/profile/AccountSecurityPanel";
import { DigitalEntitlementsSection } from "@/components/profile/DigitalEntitlementsSection";
import { GalleryAccessPanel } from "@/components/profile/GalleryAccessPanel";
import { OrderHistorySection } from "@/components/profile/OrderHistorySection";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { useToast } from "@/components/ui/ToastProvider";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";
import type { UserProfile } from "@/types/auth";

type AccountSection =
  | "profile"
  | "security"
  | "orders"
  | "downloads"
  | "licences"
  | "gallery";

const accountSections: Array<{
  id: AccountSection;
  label: string;
  description: string;
  icon: typeof FaUser;
  available: boolean;
}> = [
  {
    id: "profile",
    label: "Profile & Shipping",
    description: "Edit account details and default delivery information.",
    icon: FaUser,
    available: true,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and account deletion controls.",
    icon: FaShieldAlt,
    available: true,
  },
  {
    id: "orders",
    label: "Orders",
    description: "Review completed art print and digital purchases.",
    icon: FaHistory,
    available: true,
  },
  {
    id: "downloads",
    label: "Downloads",
    description: "Access purchased digital photo and video files.",
    icon: FaKey,
    available: true,
  },
  {
    id: "licences",
    label: "Licences",
    description: "Download personal licence PDFs for digital purchases.",
    icon: FaIdBadge,
    available: true,
  },
  {
    id: "gallery",
    label: "Gallery Access",
    description: "View and manage private gallery access status.",
    icon: FaImages,
    available: true,
  },
];

const getDisplayName = (profile: UserProfile) => {
  const fullName = [profile.first_name, profile.last_name]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");
  return fullName || profile.username || profile.email || "Your account";
};

function AccountSectionButton({
  section,
  active,
  onSelect,
}: {
  section: (typeof accountSections)[number];
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = section.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!section.available}
      className={`flex w-full items-start gap-4 rounded-xl px-5 py-4 text-left transition-all ${
        active
          ? "bg-brand-500 text-paper shadow-lg"
          : "text-gray-400 hover:bg-white/10 hover:text-white"
      } ${
        section.available
          ? ""
          : "cursor-not-allowed opacity-60 hover:bg-transparent hover:text-gray-400"
      }`}
    >
      <Icon className="mt-1 shrink-0" aria-hidden="true" />
      <span>
        <span className="block font-bold">{section.label}</span>
        <span
          className={`mt-1 block text-xs leading-relaxed ${
            active ? "text-paper/80" : "text-gray-500"
          }`}
        >
          {section.description}
        </span>
      </span>
    </button>
  );
}

function AccountStatusCards({ user }: { user: UserProfile }) {
  return (
    <section aria-labelledby="account-status" className="pt-2">
      <h3 id="account-status" className="mb-4 font-serif text-2xl font-bold text-white">
        Account Status
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            Account type
          </p>
          <p className="text-sm font-semibold text-white">
            {user.is_staff ? "Staff" : "Customer"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            Email verification
          </p>
          <p className="text-sm font-semibold text-white">
            Not exposed by the profile endpoint
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 md:col-span-2">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            Digital gallery access
          </p>
          <p className="text-sm font-semibold text-white">
            {user.can_access_gallery
              ? "Access granted"
              : "No active gallery access on this account"}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProfilePageClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, logout, refreshUser } = useAuth();
  const [activeSection, setActiveSection] = useState<AccountSection>("profile");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const handleProfileRefresh = async () => {
    setProfileError(null);
    const refreshed = await refreshUser();
    if (!refreshed) {
      throw new Error("Could not refresh your profile.");
    }
  };

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    try {
      await handleProfileRefresh();
      showToast("Profile refreshed.", "success");
    } catch (error) {
      setProfileError(
        normalizeAuthErrorMessage(error, "Could not refresh your profile."),
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast("You have been logged out.", "success");
    router.replace("/login");
  };

  if (!user) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gray-900 p-8 text-center text-gray-400">
        We could not load your profile yet.
      </div>
    );
  }

  return (
    <div className="page-top-offset min-h-screen bg-black pb-20 text-white">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 border-b border-white/10 pb-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Account
          </p>
          <h1 className="mb-2 font-serif text-4xl font-bold text-white">
            My Account
          </h1>
          <p className="max-w-2xl text-gray-400">
            Manage your OpenÉire Studios profile, security settings, and future
            account areas as they migrate.
          </p>
          {user.is_staff ? (
            <div className="mt-5">
              <span className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-bold text-accent">
                <FaShieldAlt aria-hidden="true" />
                Staff account
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="w-full lg:w-1/4">
            <nav
              aria-label="Account sections"
              className="flex flex-col space-y-2 rounded-2xl border border-white/10 bg-gray-900 p-4"
            >
              {accountSections.map((section) => (
                <AccountSectionButton
                  key={section.id}
                  section={section}
                  active={activeSection === section.id}
                  onSelect={() => {
                    if (section.available) setActiveSection(section.id);
                  }}
                />
              ))}
            </nav>
          </aside>

          <main className="relative min-h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-gray-900 p-6 shadow-2xl md:p-10 lg:w-3/4">
            <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/5 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-white">
                    {getDisplayName(user)}
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Signed in as {user.email || user.username}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleRefreshClick}
                    disabled={isRefreshing}
                    className="rounded-lg border border-white/15 px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-300 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-paper shadow-lg transition-all hover:bg-brand-700 active:scale-[0.98]"
                  >
                    <FaSignOutAlt aria-hidden="true" />
                    Log Out
                  </button>
                </div>
              </div>

              {profileError ? (
                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                  {profileError}
                </div>
              ) : null}

              {activeSection === "profile" ? (
                <div className="space-y-10">
                  <ProfileEditForm
                    profile={user}
                    onSaved={handleProfileRefresh}
                    onSuccess={(message) => showToast(message, "success")}
                  />
                  <AccountStatusCards user={user} />
                </div>
              ) : null}

              {activeSection === "security" ? (
                <AccountSecurityPanel
                  currentEmail={user.email}
                />
              ) : null}

              {activeSection === "orders" ? (
                <OrderHistorySection />
              ) : null}

              {activeSection === "downloads" ? (
                <DigitalEntitlementsSection mode="downloads" />
              ) : null}

              {activeSection === "licences" ? (
                <DigitalEntitlementsSection mode="licences" />
              ) : null}

              {activeSection === "gallery" ? (
                <GalleryAccessPanel user={user} />
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
