import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../../../Redux/slices/allUsersSlice.js";

const UserRegistrationForm = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const role = watch("role", "student"); // Watch the role field

  const onSubmit = async (data) => {
    try {
      let response;

      if (role === "admin") {
        response = await axios.post("/api/v1/register/admin", {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          department: data.department,
        });
      } else if (role === "teacher") {
        response = await axios.post("/api/v1/register/teacher", {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          subjectSpecialization: data.subjectSpecialization,
        });
      } else if (role === "student") {
        response = await axios.post("/api/v1/register/student", {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          classEnrolled: data.classEnrolled,
          dateOfBirth: data.dateOfBirth,
          guardianDetails: {
            fatherName: data.guardianDetails.fatherName,
            motherName: data.guardianDetails.motherName,
            contactNumber: data.guardianDetails.contactNumber,
            address: {
              street: data.guardianDetails.address.street,
              city: data.guardianDetails.address.city,
              state: data.guardianDetails.address.state,
              postalCode: data.guardianDetails.address.postalCode,
            },
          },
        });
      } else {
        console.error("Unknown role:", role);
        return;
      }

      // Handle success
      alert("Registration successful!");
      console.log("Response data:", response.data);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-4">User Registration</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Common Fields */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Full Name</label>
          <input
            type="text"
            {...register("fullName", { required: "Full Name is required" })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", {
              required: role !== "student" && "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Enter a valid email address",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Role</label>
          <select
            {...register("role")}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Conditional Fields based on Role */}

        {/* Student Fields */}
        {role === "student" && (
          <>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Class Enrolled */}
              <div className="mb-4 w-full md:w-1/2">
                <label className="block mb-1 font-medium text-gray-700">
                  Class Enrolled
                </label>
                <input
                  type="text"
                  {...register("classEnrolled", {
                    required: "Class is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.classEnrolled && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.classEnrolled.message}
                  </p>
                )}
              </div>

              {/* Section Dropdown */}
              <div className="mb-4 h-full w-full md:w-1/2">
                <label className="block mb-1 font-medium text-gray-700">
                  Section
                </label>
                <select
                  {...register("section", {
                    required: "Section is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
                {errors.section && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.section.message}
                  </p>
                )}
              </div>
            </div>

            {/* Academic Year Dropdown */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Academic Year</label>
              <select
                {...register("academicYear", {
                  required: "Academic Year is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="2024-2025">2024-2025</option>
              </select>
              {errors.academicYear && (
                <p className="text-red-500 text-sm">
                  {errors.academicYear.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Date of Birth</label>
              <input
                type="date"
                {...register("dateOfBirth", {
                  required: "Date of Birth is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Guardian Details */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Father's Name</label>
              <input
                type="text"
                {...register("guardianDetails.fatherName", {
                  required: "Father's Name is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.guardianDetails?.fatherName && (
                <p className="text-red-500 text-sm">
                  {errors.guardianDetails.fatherName.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Mother's Name</label>
              <input
                type="text"
                {...register("guardianDetails.motherName", {
                  required: "Mother's Name is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.guardianDetails?.motherName && (
                <p className="text-red-500 text-sm">
                  {errors.guardianDetails.motherName.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">
                Guardian Contact Number
              </label>
              <input
                type="text"
                {...register("guardianDetails.contactNumber", {
                  required: "Guardian's contact number is required",
                  pattern: {
                    value: /^\d{10,15}$/,
                    message: "Please provide a valid contact number",
                  },
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.guardianDetails?.contactNumber && (
                <p className="text-red-500 text-sm">
                  {errors.guardianDetails.contactNumber.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Street</label>
              <input
                type="text"
                {...register("guardianDetails.address.street", {
                  required: "Street is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.guardianDetails?.address?.street && (
                <p className="text-red-500 text-sm">
                  {errors.guardianDetails.address.street.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">City</label>
              <input
                type="text"
                {...register("guardianDetails.address.city", {
                  required: "City is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.guardianDetails?.address?.city && (
                <p className="text-red-500 text-sm">
                  {errors.guardianDetails.address.city.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">State</label>
              <input
                type="text"
                {...register("guardianDetails.address.state", {
                  required: "State is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.guardianDetails?.address?.state && (
                <p className="text-red-500 text-sm">
                  {errors.guardianDetails.address.state.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Postal Code</label>
              <input
                type="text"
                {...register("guardianDetails.address.postalCode", {
                  required: "Postal Code is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.guardianDetails?.address?.postalCode && (
                <p className="text-red-500 text-sm">
                  {errors.guardianDetails.address.postalCode.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Country</label>
              <input
                type="text"
                placeholder="India"
                disabled
                {...register("guardianDetails.address.country")}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.guardianDetails?.address?.country && (
                <p className="text-red-500 text-sm">
                  {errors.guardianDetails.address.country.message}
                </p>
              )}
            </div>
          </>
        )}

        {/* Teacher Fields */}
        {role === "teacher" && (
          <>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">
                Subject Specialization
              </label>
              <input
                type="text"
                {...register("subjectSpecialization", {
                  required: "Subject Specialization is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.subjectSpecialization && (
                <p className="text-red-500 text-sm">
                  {errors.subjectSpecialization.message}
                </p>
              )}
            </div>
          </>
        )}

        {/* Admin Fields */}
        {role === "admin" && (
          <>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Department</label>
              <select
                {...register("department", {
                  required: "Department is required",
                })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Department</option>
                <option value="Admin Office">Admin Office</option>
                <option value="Operations and Facilities">
                  Operations and Facilities
                </option>
                <option value="IT and Technology">IT and Technology</option>
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm">
                  {errors.department.message}
                </p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
