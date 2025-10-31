// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import {
  getProfile,
  updateProfile,
  UserProfile,
  UserProfileUpdateData,
} from "../services/api";
import EditProfileForm from "../components/EditProfileForm";
import OrderHistoryList from "../components/OrderHistoryList";
import UpdateAccountForm from "../components/UpdateAccountForm"; // You're already importing this
import ChangePasswordForm from "../components/ChangePasswordForm"; // And this

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false); // This controls the shipping form

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (err) {
        setError("Failed to fetch profile. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (data: UserProfileUpdateData) => {
    try {
      const updatedProfile = await updateProfile(data);
      setProfile(updatedProfile);
      setIsEditing(false); // Exit edit mode on success
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          {!isEditing && profile && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90"
            >
              {/* 1. Renamed button for clarity */}
              Edit Shipping Info
            </button>
          )}
        </div>

        {profile ? (
          isEditing ? (
            <EditProfileForm
              initialData={profile}
              onSubmit={handleProfileUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            // This 'div' now wraps all non-editing content
            <div>
              <div className="space-y-4">
                {/* --- Your existing profile display --- */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">
                    Username
                  </h2>
                  <p className="text-lg">{profile.username}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Name</h2>
                  <p className="text-lg">
                    {profile.first_name} {profile.last_name}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">Email</h2>
                  <p className="text-lg">{profile.email}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">
                    Phone Number
                  </h2>
                  <p className="text-lg">
                    {profile.default_phone_number || "Not provided"}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-500">
                    Address
                  </h2>
                  <p className="text-lg">
                    {profile.default_street_address1 || ""}
                    {profile.default_street_address2 &&
                      `, ${profile.default_street_address2}`}
                    {[
                      profile.default_town,
                      profile.default_county,
                      profile.default_postcode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    <br />
                    {profile.default_country || "Address not provided"}
                  </p>
                </div>
              </div>

              <div className="space-y-8 border-t mt-8 pt-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  Account Settings
                </h2>
                <UpdateAccountForm profile={profile} />
                <ChangePasswordForm />
              </div>

              <OrderHistoryList />
            </div>
          )
        ) : (
          <p>No profile data found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
