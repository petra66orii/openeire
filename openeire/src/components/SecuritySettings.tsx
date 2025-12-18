import React from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";
import DeleteAccount from "./DeleteAccount";

const SecuritySettings: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Security Settings
      </h2>

      <div className="space-y-10 max-w-2xl">
        <section>
          <ChangeEmailForm />
        </section>

        <hr className="border-gray-200" />

        <section>
          <ChangePasswordForm />
        </section>

        <hr className="border-gray-200" />

        <section className="bg-red-50 p-6 rounded-lg border border-red-100">
          <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <DeleteAccount />
        </section>
      </div>
    </div>
  );
};

export default SecuritySettings;
