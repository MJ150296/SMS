import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSchoolProfile,
  updateSchoolProfile,
} from "../../../../Redux/slices/schoolProfileDataSlice";

const SchoolProfile = () => {
  const dispatch = useDispatch();
  const { schoolProfile, isLoading, error } = useSelector(
    (state) => state.schoolProfile
  );
  const [logoUrl, setLogoUrl] = useState(null);

  const [updatedSchoolData, setUpdatedSchoolData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: schoolProfile?.schoolProfile || {}, // Set initial values when available
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append form data
    for (const key in data) {
      if (typeof data[key] === "object" && !Array.isArray(data[key])) {
        for (const subKey in data[key]) {
          formData.append(`${key}.${subKey}`, data[key][subKey]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    if (logoUrl) {
      formData.append("logoUrl", logoUrl);
    }

    const result = dispatch(updateSchoolProfile(formData))
      .unwrap()
      .then((result) => {
        console.log("Update successful:", result);
        // Handle successful response here, like showing a success message or redirecting
      })
      .catch((error) => {
        console.error("Update failed:", error);
        // Handle the error here, like showing an error message
      });
  };

  // Fetch school profile data when component mounts
  useEffect(() => {
    if (!schoolProfile || !schoolProfile.schoolProfile) {
      dispatch(fetchSchoolProfile()); // Dispatch action to fetch profile data if it's not available
    }
  }, [schoolProfile]);

  const handleFileChange = (e) => {
    setLogoUrl(e.target.files[0]);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-md shadow-lg max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        School Profile
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="space-y-6"
      >
        {/* School Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            School Name:
          </label>
          <input
            {...register("name", {
              required: true,
              maxLength: 100,
            })}
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">
              School name is required (max 100 characters).
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Address:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <input
                {...register("address.street", { required: true })}
                type="text"
                placeholder="Street Address"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              {errors.address?.street && (
                <p className="text-red-500 text-sm">Street is required.</p>
              )}
            </div>
            <div>
              <input
                {...register("address.city", { required: true })}
                type="text"
                placeholder="City"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              {errors.address?.city && (
                <p className="text-red-500 text-sm">City is required.</p>
              )}
            </div>
            <div>
              <input
                {...register("address.state", { required: true })}
                type="text"
                placeholder="State"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              {errors.address?.state && (
                <p className="text-red-500 text-sm">State is required.</p>
              )}
            </div>
            <div>
              <input
                {...register("address.postalCode", { required: true })}
                type="text"
                placeholder="Postal Code"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              {errors.address?.postalCode && (
                <p className="text-red-500 text-sm">Postal code is required.</p>
              )}
            </div>
            <div>
              <input
                {...register("address.country")}
                type="text"
                placeholder="Country"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Contact Number:
          </label>
          <input
            {...register("contactNumber", {
              required: true,
              pattern: /^[0-9]{10,15}$/,
            })}
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm">
              Contact number must be between 10 and 15 digits.
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email:
          </label>
          <input
            type="email"
            {...register("email", {
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
            })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Please enter a valid email.</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Website:
          </label>
          <input
            type="text"
            {...register("website", {
              pattern:
                /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(:\d+)?(\/[\w\d-]*)*\/?$/,
            })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.website && (
            <p className="text-red-500 text-sm">Please enter a valid URL.</p>
          )}
        </div>

        {/* Established Year */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Established Year:
          </label>
          <input
            type="number"
            {...register("establishedYear", {
              min: 1800,
              max: new Date().getFullYear(),
            })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.establishedYear && (
            <p className="text-red-500 text-sm">
              Year must be between 1800 and {new Date().getFullYear()}.
            </p>
          )}
        </div>

        {/* School Type */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            School Type:
          </label>
          <select
            {...register("schoolType", { required: true })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="International">International</option>
          </select>
        </div>

        {/* Affiliated Board */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Affiliated Board:
          </label>
          <select
            {...register("affiliatedBoard", { required: true })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="State Board">State Board</option>
            <option value="IB">IB</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Principal Information */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Principal's Full Name:
          </label>
          <input
            type="text"
            {...register("principal.fullName", { required: true })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.principal?.fullName && (
            <p className="text-red-500 text-sm">
              Principal's full name is required.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Principal's Contact Number:
          </label>
          <input
            type="text"
            {...register("principal.contactNumber", {
              required: true,
              pattern: /^[0-9]{10,15}$/,
            })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.principal?.contactNumber && (
            <p className="text-red-500 text-sm">
              Please enter a valid contact number.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Principal's Email:
          </label>
          <input
            type="email"
            {...register("principal.email", {
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
            })}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {errors.principal?.email && (
            <p className="text-red-500 text-sm">Please enter a valid email.</p>
          )}
        </div>

        {/* School Logo */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Avatar:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-6 py-2 mt-4 hover:bg-blue-700 transition duration-200"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
        {error && <p className="text-red-500">Error: {error}</p>}
      </form>
    </div>
  );
};

export default SchoolProfile;
