// src/components/EditProfileForm.tsx

import React, { useState } from "react";
import { UserProfile, UserProfileUpdateData } from "../services/api";

interface EditProfileFormProps {
  initialData: UserProfile;
  onSubmit: (data: UserProfileUpdateData) => Promise<void>;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-500">
          Phone Number
        </label>
        <input
          type="text"
          name="default_phone_number"
          value={formData.default_phone_number || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border rounded-md"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-500">
          Address Line 1
        </label>
        <input
          type="text"
          name="default_street_address1"
          value={formData.default_street_address1 || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border rounded-md"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-500">
          Address Line 2
        </label>
        <input
          type="text"
          name="default_street_address2"
          value={formData.default_street_address2 || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border rounded-md"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-500">Town/City</label>
        <input
          type="text"
          name="default_town"
          value={formData.default_town || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border rounded-md"
        />
      </div>
      {/* Add inputs for county, postcode, and country similarly */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
