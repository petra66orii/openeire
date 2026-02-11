import React from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";
import DeleteAccount from "./DeleteAccount";

const SecuritySettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
        Security Settings
      </h2>

      <div className="space-y-12 max-w-2xl">
        <section>
          <ChangeEmailForm />
        </section>

        <section className="pt-8 border-t border-white/10">
          <ChangePasswordForm />
        </section>

        <section className="pt-8 border-t border-white/10">
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-400/80 mb-6">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <DeleteAccount />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecuritySettings;
