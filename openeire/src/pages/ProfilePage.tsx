import React, { useState, useEffect } from "react";
import { getProfile, UserProfile } from "../services/api";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">Your Profile</h1>
        {profile ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-500">Username</h2>
              <p className="text-lg">{profile.username}</p>
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
              <h2 className="text-sm font-semibold text-gray-500">Address</h2>
              <p className="text-lg">
                {profile.default_street_address1 || ""}
                {profile.default_street_address2 &&
                  `, ${profile.default_street_address2}`}
                <br />
                {profile.default_town || ""}, {profile.default_county || ""},{" "}
                {profile.default_postcode || ""}
                <br />
                {profile.default_country || "Address not provided"}
              </p>
            </div>
          </div>
        ) : (
          <p>No profile data found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
