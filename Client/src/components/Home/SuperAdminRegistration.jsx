import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginUser } from "../../Redux/slices/currentUserSlice";

const SuperAdminRegistration = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  // const [loggedOut, setLoggedOut] = useState(false);

  const loggedOut = location?.state?.loggedOut;
  // console.log(loggedOut);

  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const { userInfo, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      // console.log("User Info", userInfo);
      // It means logged In successfully
      navigate("/dashboard");
    }
  }, [userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null); // Clear previous errors

    if (isLoggingIn) {
      // ********************************************************//
      dispatch(loginUser(data)); // Redux thunk in currentUserSlice.js for user login
    } else {
      try {
        const response = await fetch("/api/v1/users/register-superadmin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            role: "superAdmin", // Enforce superAdmin role
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setServerError(
            result.message || "Something went wrong. Please try again."
          );
        } else {
          setSuccess(true);
        }
      } catch (err) {
        setServerError("Failed to register. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (success) {
      // Success on registering the super admin
      // Redirecting the register page to Login Page
      setTimeout(() => {
        setIsLoggingIn(true);
        setSuccess(false);
      }, 1500);
    }
    if (loggedOut) {
      // If user logs out, it redirects it to Login Page not Register page
      setIsLoggingIn(true);
    }
  }, [success, loggedOut]);

  useEffect(() => {
    const checkSuperAdminRegistration = async () => {
      try {
        // Make a GET request to the /api/v1/school/isSuperAdminRegistered route
        const response = await axios.get(
          "/api/v1/users/isSuperAdminRegistered"
        );

        // Handle the response
        if (response.data) {
          // console.log(response.data);

          const { data } = response.data;
          // console.log(data.superAdminRegistered);

          if (data.superAdminRegistered) {
            setIsLoggingIn(true); //This is where every time the page is rendering to login page
            // If Super Admin is registered
            console.log(response.data.message);
            // Perform action to render login page
          } else {
            setIsLoggingIn(false); //This will render to the signup page as no super Admin is registered.
            console.log(response.data.message);
          }
        } else {
          // If Super Admin is not registered
          console.log(response.data.message);
          // Perform action to render registration page for Super Admin
        }
      } catch (error) {
        // Handle any errors that occur during the request
        console.error("Error checking Super Admin registration:", error);
        alert("Something went wrong! Please try again later.");
      }
    };
    checkSuperAdminRegistration();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10">
      {success ? (
        <div className="w-full md:h-[500px] flex justify-center items-center">
          <div className="bg-green-100 text-green-700 p-4 rounded text-center text-xl">
            Super Admin registered successfully!
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          {isLoggingIn ? (
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Login Super Admin
            </h1>
          ) : (
            <div className="flex flex-col w-full">
              <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Register Super Admin
              </h1>
              <div className="w-full flex justify-end items-center">
                <button
                  className="text-blue-600 underline"
                  onClick={() => {
                    setIsLoggingIn(true);
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {serverError && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Field */}
            {!isLoggingIn && (
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  {...register("fullName", {
                    required: "Full Name is required",
                    minLength: { value: 3, message: "Minimum length is 3" },
                    maxLength: { value: 100, message: "Maximum length is 100" },
                  })}
                  className={`w-full px-4 py-2 border text-black ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <ErrorMessage
                  errors={errors}
                  name="fullName"
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mt-1">{message}</p>
                  )}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-2 border text-black ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <p className="text-red-500 text-sm mt-1">{message}</p>
                )}
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full px-4 py-2 border text-black ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ message }) => (
                  <p className="text-red-500 text-sm mt-1">{message}</p>
                )}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              {isLoggingIn ? <>Login</> : <>Register</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuperAdminRegistration;
