import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../../../Redux/slices/allUsersSlice.js";

const UserRegistrationForm = () => {
  const dispatch = useDispatch();

  const [isTransportation, setIsTransportation] = useState(false);
  const [isHostelRequired, setIsHostelRequired] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const role = watch("role", "student"); // Watch the role field, Whose input fields will be
  //  displayed in the default form
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
          academicYear: data.academicYear,
          classEnrolled: data.classEnrolled,
          section: data.section,
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
          hostel: data.hostel,
          transportation: data.transportation,
          concessions: data.concessions,
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
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {/* Conditional Fields based on Role */}

        {/* Student Fields */}
        {role === "student" && (
          <>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Class Enrolled */}
              <div className="mb-4 w-full md:w-1/2">
                <label className="block mb-1  text-gray-700">
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
                <label className="block mb-1   text-gray-700">Section</label>
                <select
                  {...register("section", {
                    required: "Section is required",
                  })}
                  defaultValue="A"
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
                defaultValue="2000-01-01" // Setting the default value to January 1, 2000
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
                  value: "Mayank Joshi",
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
                  value: "Mayank Joshi",
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
                  value: "07895927366",
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
                  value: "abc",
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
                  value: "xyz",
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
                  value: "jkl",
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
                  value: "201009",
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

            {/* Checkbox for Is Transportation */}
            <div className="mb-4 flex gap-x-3 items-center">
              <input
                type="checkbox"
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (!checked) {
                    reset({
                      transportation: "",
                    });
                  }
                  setIsTransportation(e.target.checked);
                }}
                className="mr-2 w-4 h-4"
              />
              <div>
                <label className="block mb-1 text-gray-700">
                  Transportation Required
                </label>
              </div>
            </div>

            {/* Conditionally render transportation options if Is Transportation is checked */}
            {isTransportation && (
              <div className="space-y-4 mb-6">
                {/* Select Distance Dropdown */}
                <div className="mb-4">
                  <label className="block mb-1   text-gray-700">
                    Select Distance
                  </label>
                  <select
                    {...register("transportation.distance", {
                      required: "Please select a distance",
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Distance</option>
                    <option value="upto 10km">Upto 10km</option>
                    <option value="10-20km">10-20km</option>
                    <option value="above 20km">Above 20km</option>
                  </select>
                  {errors.transportation?.distance && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transportation.distance.message}
                    </p>
                  )}
                </div>

                {/* One-Way Trip or Round Trip Radio Buttons */}
                <div className="mb-4">
                  <label className="block mb-1   text-gray-700">
                    Trip Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register("transportation.tripType", {
                          required: "Please select a trip type",
                        })}
                        value="oneWay"
                        className="mr-2"
                      />
                      One-Way Trip
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register("transportation.tripType", {
                          required: "Please select a trip type",
                        })}
                        value="roundTrip"
                        className="mr-2"
                      />
                      Round Trip
                    </label>
                  </div>
                  {errors.transportation?.tripType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transportation.tripType.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Checkbox for Hostel Required */}
            <div className="mb-4 flex gap-x-3 items-center">
              <input
                type="checkbox"
                onChange={(e) => {
                  const checked = e.target.checked;
                  // Reset hostel fields when unchecked
                  if (!checked) {
                    reset({
                      hostel: "",
                    });
                  }
                  setIsHostelRequired(e.target.checked);
                }}
                className="mr-2 w-4 h-4"
              />
              <label className="block mb-1   text-gray-700">
                Hostel Required
              </label>
            </div>

            {/* Conditionally render hostel options if Hostel Required is checked */}
            {isHostelRequired && (
              <div className="space-y-4 mb-6">
                {/* Room Type Dropdown */}
                <div>
                  <label className="block mb-1   text-gray-700">
                    Room Type
                  </label>
                  <select
                    {...register("hostel.roomType", {
                      required: "Please select a room type",
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Room Type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="dormitory">Dormitory</option>
                  </select>
                  {errors.hostel?.roomType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.hostel.roomType.message}
                    </p>
                  )}
                </div>

                {/* Boarding Option Dropdown */}
                <div>
                  <label className="block mb-1 text-gray-700">
                    Boarding Option
                  </label>
                  <select
                    {...register("hostel.boardingOption", {
                      required: "Please select a boarding option",
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Boarding Option</option>
                    <option value="fullTime">Full Time</option>
                    <option value="weekDays">Week Days</option>
                    <option value="weekEnds">Week Ends</option>
                  </select>
                  {errors.hostel?.boardingOption && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.hostel.boardingOption.message}
                    </p>
                  )}
                </div>

                {/* Meal Plan Dropdown */}
                <div>
                  <label className="block mb-1 text-gray-700">Meal Plan</label>
                  <select
                    {...register("hostel.mealPlan", {
                      required: "Please select a meal Plan",
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Meal Plan</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                  {errors.hostel?.mealPlan && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.hostel.mealPlan.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Concessions */}
            <div className="mb-4 flex items-center gap-x-3">
              <input
                type="checkbox"
                {...register("concessions.siblingDiscount")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="block mb-1 text-gray-700">
                Sibling Discount
              </label>
              {errors.concessions?.siblingDiscount && (
                <p className="text-red-500 text-sm">
                  {errors.concessions.siblingDiscount.message}
                </p>
              )}
            </div>

            <div className="mb-4 flex items-center gap-x-3">
              <input
                type="checkbox"
                {...register("concessions.incomeBasedDiscount")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="block mb-1 text-gray-700">
                Income-Based Discount
              </label>

              {errors.concessions?.incomeBasedDiscount && (
                <p className="text-red-500 text-sm">
                  {errors.concessions.incomeBasedDiscount.message}
                </p>
              )}
            </div>

            <div className="mb-4 flex items-center gap-x-3">
              <input
                type="checkbox"
                {...register("concessions.meritScholarship")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="block mb-1 text-gray-700">
                Merit Scholarship
              </label>

              {errors.concessions?.meritScholarship && (
                <p className="text-red-500 text-sm">
                  {errors.concessions.meritScholarship.message}
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
            <>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">
                  Academic Year
                </label>
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

              <div className="mb-4">
                <label className="block mb-1 text-gray-700">Base Salary</label>
                <select
                  {...register("baseSalary", {
                    required: "Base Salary is required",
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Salary Type</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="seniorSecondary">Senior Secondary</option>
                </select>
                {errors.baseSalary && (
                  <p className="text-red-500 text-sm">
                    {errors.baseSalary.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("allowances.houseAllowance")}
                    className="mr-2"
                  />
                  <span className="text-gray-700"> House Allowance</span>
                </div>
                {errors.allowances?.houseAllowance && (
                  <p className="text-red-500 text-sm">
                    {errors.allowances?.houseAllowance.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("allowances.transportationAllowance")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">
                    Transportation Allowance
                  </span>
                </div>
                {errors.allowances?.transportationAllowance && (
                  <p className="text-red-500 text-sm">
                    {errors.allowances?.transportationAllowance.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("allowances.medicalAllowance")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Medical Allowance</span>
                </div>
                {errors.allowances?.medicalAllowance && (
                  <p className="text-red-500 text-sm">
                    {errors.allowances?.medicalAllowance.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("allowances.specialAllowance")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Special Allowance</span>
                </div>
                {errors.allowances?.specialAllowance && (
                  <p className="text-red-500 text-sm">
                    {errors.allowances?.specialAllowance.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-gray-700">
                  Other Allowance Description
                </label>
                <input
                  type="text"
                  {...register("allowances.otherAllowances.description")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.allowances?.otherAllowances?.description && (
                  <p className="text-red-500 text-sm">
                    {errors.allowances?.otherAllowances?.description.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-gray-700">
                  Other Allowance Amount
                </label>
                <input
                  type="number"
                  {...register("allowances.otherAllowances.amount", {
                    min: {
                      value: 0,
                      message: "Amount cannot be negative",
                    },
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.allowances?.otherAllowances?.amount && (
                  <p className="text-red-500 text-sm">
                    {errors.allowances?.otherAllowances?.amount.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("deductions.taxDeduction")}
                    className="mr-2"
                  />
                  <span className="text-gray-700"> Tax Deduction</span>
                </div>
                {errors.deductions?.taxDeduction && (
                  <p className="text-red-500 text-sm">
                    {errors.deductions?.taxDeduction.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("deductions.providentFund")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">
                    Provident Fund Deduction
                  </span>
                </div>
                {errors.deductions?.providentFund && (
                  <p className="text-red-500 text-sm">
                    {errors.deductions?.providentFund.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("deductions.professionalTax")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">
                    Professional Tax Deduction
                  </span>
                </div>
                {errors.deductions?.professionalTax && (
                  <p className="text-red-500 text-sm">
                    {errors.deductions?.professionalTax.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-gray-700">
                  Other Deduction Description
                </label>
                <input
                  type="text"
                  {...register("deductions.otherDeductions.description")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.deductions?.otherDeductions?.description && (
                  <p className="text-red-500 text-sm">
                    {errors.deductions?.otherDeductions?.description.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-gray-700">
                  Other Deduction Amount
                </label>
                <input
                  type="number"
                  {...register("deductions.otherDeductions.amount", {
                    min: {
                      value: 0,
                      message: "Amount cannot be negative",
                    },
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.deductions?.otherDeductions?.amount && (
                  <p className="text-red-500 text-sm">
                    {errors.deductions?.otherDeductions?.amount.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("bonuses.performanceBonus")}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Performance Bonus</span>
                </div>
                {errors.bonuses?.performanceBonus && (
                  <p className="text-red-500 text-sm">
                    {errors.bonuses?.performanceBonus.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("bonuses.festivalBonus")}
                    className="mr-2"
                  />
                  <span className="text-gray-700"> Festival Bonus</span>
                </div>
                {errors.bonuses?.festivalBonus && (
                  <p className="text-red-500 text-sm">
                    {errors.bonuses?.festivalBonus.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-gray-700">
                  Other Bonus Description
                </label>
                <input
                  type="text"
                  {...register("bonuses.otherBonuses.description")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.bonuses?.otherBonuses?.description && (
                  <p className="text-red-500 text-sm">
                    {errors.bonuses?.otherBonuses?.description.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-gray-700">
                  Other Bonus Amount
                </label>
                <input
                  type="number"
                  {...register("bonuses.otherBonuses.amount", {
                    min: {
                      value: 0,
                      message: "Amount cannot be negative",
                    },
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.bonuses?.otherBonuses?.amount && (
                  <p className="text-red-500 text-sm">
                    {errors.bonuses?.otherBonuses?.amount.message}
                  </p>
                )}
              </div>
            </>
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
