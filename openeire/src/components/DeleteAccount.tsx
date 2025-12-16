import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../services/api"; // Verify this path matches your file structure
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext"; // Verify this path matches your file structure

const DeleteAccount: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { logoutUser } = useContext(AuthContext) as any;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await deleteAccount(password);
      toast.success("Your account has been deleted.");

      logoutUser();

      navigate("/");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.password?.[0] ||
          err.response?.data?.detail ||
          "Failed to delete account. Check your password."
      );
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 pt-10 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
          <p className="mt-1 text-sm text-gray-500">
            Permanently remove your account and all associated data.
          </p>
        </div>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 rounded-md font-medium text-sm transition-colors"
          >
            Delete Account
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {/* Warning Icon */}
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3 w-full">
              <h4 className="text-md font-bold text-red-800">
                Are you absolutely sure?
              </h4>
              <p className="mt-2 text-sm text-red-700">
                This action cannot be undone. This will permanently delete your
                account, order history, and saved preferences.
              </p>

              <form onSubmit={handleDelete} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="delete-password"
                    className="block text-sm font-medium text-red-800"
                  >
                    Confirm your password
                  </label>
                  <input
                    type="password"
                    id="delete-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border-red-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
                    placeholder="Enter your password to confirm"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  >
                    {loading ? "Deleting..." : "Permanently Delete Account"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setPassword("");
                    }}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
