import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { NODE_ENV } from "../constants.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken; // Save refresh Token in the Schema (user model)

    await user.save({ validateBeforeSave: false }); // Here I know user is valid because I have userId, so save without validating

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerSuperAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validation
  if (!fullName || !email || !password) {
    throw new ApiError(400, "Please fill in all fields");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Hash password  already in user.model in pre function
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new Super Admin user
  const user = await User.create({
    fullName,
    email,
    password,
    role: "superAdmin", // Enforcing superAdmin role
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(512, "Something wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, { user }, "Super Admin registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check if email and password are provided
  if (!email || !password) {
    throw new ApiError(400, "Please provide both email and password");
  }

  // 2. Find Super Admin by email
  const user = await User.findOne({ email, role: "superAdmin" }); // Ensure it's a super admin

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Compare the provided password with the hashed password stored in the database
  const isPasswordCorrect = await user.matchPassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 4. Generate JWT token
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(
      502,
      "Internal Server Error, Unable to fetch logged in user"
    );
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  // 5. Return success response with secure token and super admin info

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log(req.user);

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1, // Removes the field from document.
      },
    },
    {
      new: true,
    }
  );
  console.log("User logged out successfully");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getUserCount = asyncHandler(async (req, res) => {
  try {
    // Count the number of documents in the User collection
    const userCount = await User.countDocuments();

    // Check if the count is greater than 1
    if (userCount > 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { superAdminRegistered: true },
            "Super Admin Registered , now only render the login page"
          )
        );
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { superAdminRegistered: false },
            "Need to create Super Admin, no super Admin Found"
          )
        );
    }
  } catch (error) {
    // Handle any errors that occur during the count
    console.error("Error fetching user count:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

const getAllUserData = asyncHandler(async (req, res) => {
  try {
    // Fetch all users from the User model, excluding password and refreshToken fields
    const users = await User.find({}, "-password -refreshToken");

    // Send the users data as a response
    return res.status(200).json(
      new ApiResponse(200, {
        success: true,
        data: users,
        message: "Successfully fetched all user data",
      })
    );
  } catch (error) {
    // Handle any errors that occur during fetching
    console.error("Error fetching all user data:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch user data",
    });
  }
});

const userProfileUpdate = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is obtained from JWT verification middleware
    const { fullName, email, contactNumber } = req.body; // Update to use contactNumber
    let avatarUrl;

    // Check if the request contains a file (avatar upload)
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(
        req.file.path,
        `avatars/${fullName}`
      );
      if (!cloudinaryResult) {
        return res.status(400).json({ message: "Failed to upload avatar" });
      }
      avatarUrl = cloudinaryResult.secure_url; // Get the avatar URL from Cloudinary
    }

    // Find user by ID and update the profile
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Restrict updates for students, allow only password reset
    if (user.role === "student" && req.body.password) {
      user.password = req.body.password; // Password reset for students
    } else if (user.role !== "student") {
      // Allow profile updates for non-students
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (contactNumber) user.contactNumber = contactNumber; // Update contact number
      if (avatarUrl) user.avatarUrl = avatarUrl; // Update avatar URL
    } else {
      return res
        .status(403)
        .json({ message: "Students can only reset their password." });
    }

    // Save the updated user profile
    const updatedUser = await user.save();
    return res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

export {
  registerSuperAdmin,
  loginUser,
  logoutUser,
  getUserCount,
  getAllUserData,
  userProfileUpdate,
};
