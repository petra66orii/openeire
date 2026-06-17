"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { changePassword, deleteAccount } from "@/lib/api/account";
import { normalizeAuthErrorMessage } from "@/lib/api/auth";

const inputClass =
  "w-full rounded-lg border border-white/20 bg-black p-3 text-white outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500";
const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function AccountSecurityPanel({
  currentEmail,
}: {
  currentEmail: string;
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [deleteForm, setDeleteForm] = useState({
    password: "",
    confirmation: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handlePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (isChangingPassword) return;

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);
    try {
      const response = await changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      showToast(response.message || "Password changed successfully.", "success");
    } catch (error) {
      setPasswordError(
        normalizeAuthErrorMessage(error, "Could not change your password."),
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDeletingAccount) return;

    if (deleteForm.confirmation.trim().toUpperCase() !== "DELETE") {
      setDeleteError('Type "DELETE" to confirm account deletion.');
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError(null);
    try {
      await deleteAccount({ password: deleteForm.password });
      logout();
      showToast("Your account has been deleted.", "success");
      router.replace("/");
    } catch (error) {
      setDeleteError(
        normalizeAuthErrorMessage(error, "Could not delete your account."),
      );
      setIsDeletingAccount(false);
    }
  };

  return (
    <section aria-labelledby="security-heading" className="space-y-12">
      <div className="border-b border-white/10 pb-4">
        <h3
          id="security-heading"
          className="font-serif text-3xl font-bold text-white"
        >
          Security Settings
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Update your sign-in details and manage account-level security.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-6 md:p-8">
        <h4 className="mb-6 border-b border-white/10 pb-4 text-xl font-bold text-white">
          Change Password
        </h4>
        {passwordError ? (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {passwordError}
          </div>
        ) : null}
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <Field id="security-old-password" label="Current password">
            <input
              id="security-old-password"
              type="password"
              value={passwordForm.old_password}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  old_password: event.target.value,
                }))
              }
              required
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field id="security-new-password" label="New password">
              <input
                id="security-new-password"
                type="password"
                value={passwordForm.new_password}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    new_password: event.target.value,
                  }))
                }
                required
                className={inputClass}
              />
            </Field>
            <Field id="security-confirm-password" label="Confirm password">
              <input
                id="security-confirm-password"
                type="password"
                value={passwordForm.confirm_password}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    confirm_password: event.target.value,
                  }))
                }
                required
                className={inputClass}
              />
            </Field>
          </div>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full rounded-lg bg-brand-500 px-4 py-3 font-bold text-paper shadow-lg transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChangingPassword ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-6 md:p-8">
        <h4 className="mb-2 text-xl font-bold text-white">
          Change Email Address
        </h4>
        <p className="mb-6 text-sm text-gray-400">
          Current email: <span className="font-semibold text-white">{currentEmail}</span>
        </p>
        <div className="rounded-xl border border-amber-400/20 bg-amber-950/20 p-4 text-sm leading-relaxed text-amber-100/90">
          Email changes are temporarily paused while we harden the verification
          handoff. This avoids leaving accounts inactive before the new address
          is verified. If you need to change your email before this flow is
          restored, please contact OpenÉire Studios support.
        </div>
        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-bold text-gray-500"
        >
          Email Change Temporarily Unavailable
        </button>
      </div>

      <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-6 md:p-8">
        <div className="mb-6 flex gap-4">
          <FaExclamationTriangle className="mt-1 shrink-0 text-red-400" />
          <div>
            <h4 className="text-xl font-bold text-red-300">Danger Zone</h4>
            <p className="mt-2 text-sm leading-relaxed text-red-100/80">
              Permanently delete your account and associated profile data. This
              action cannot be undone.
            </p>
          </div>
        </div>
        {deleteError ? (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {deleteError}
          </div>
        ) : null}
        <form onSubmit={handleDeleteSubmit} className="space-y-6">
          <Field id="security-delete-password" label="Confirm your password">
            <input
              id="security-delete-password"
              type="password"
              value={deleteForm.password}
              onChange={(event) =>
                setDeleteForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              required
              className={inputClass}
            />
          </Field>
          <Field id="security-delete-confirmation" label='Type "DELETE" to confirm'>
            <input
              id="security-delete-confirmation"
              type="text"
              value={deleteForm.confirmation}
              onChange={(event) =>
                setDeleteForm((current) => ({
                  ...current,
                  confirmation: event.target.value,
                }))
              }
              required
              className={inputClass}
            />
          </Field>
          <button
            type="submit"
            disabled={isDeletingAccount}
            className="w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeletingAccount ? "Deleting Account..." : "Permanently Delete Account"}
          </button>
        </form>
      </div>
    </section>
  );
}
