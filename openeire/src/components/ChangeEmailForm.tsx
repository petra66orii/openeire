import React, { useState } from "react";
import { changeEmail } from "../services/api";
import { toast } from "react-toastify";

const ChangeEmailForm: React.FC = () => {
  const [formData, setFormData] = useState({
    new_email: "",
    password: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await changeEmail(formData);
      setStatus("success");
      toast.success("Verification email sent to your new address!");
      // Clear sensitive data
      setFormData({ new_email: "", password: "" });
    } catch (err: any) {
      console.error(err);
      setStatus("idle");

      // Handle backend errors (e.g., "Incorrect password" or "Email already in use")
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to update email. Please check your password.";
      toast.error(errorMessage);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-green-800 mb-2">
          Check Your Inbox
        </h3>
        <p className="text-green-700">
          We have sent a confirmation link to your new email address. Please
          click it to finalize the change.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-green-600 hover:text-green-800 font-medium underline"
        >
          Update another email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-xl">
      <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-3 mb-4">
        Change Email Address
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="new_email"
            className="block text-sm font-medium text-gray-700"
          >
            New Email Address
          </label>
          <input
            type="email"
            name="new_email"
            id="new_email"
            required
            value={formData.new_email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password{" "}
            <span className="text-xs text-gray-500 font-normal">
              (Required to confirm)
            </span>
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${
                status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }`}
          >
            {status === "loading" ? "Verifying..." : "Update Email"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeEmailForm;
