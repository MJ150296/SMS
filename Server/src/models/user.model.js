import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define constants for user roles
const USER_ROLES = ["student", "teacher", "admin", "superAdmin"];

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot be more than 100 characters"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true, // Makes sure to allow multiple students without emails
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
        "Please add a valid email address",
      ],
      validate: {
        validator: function (email) {
          // Email is required if the role is teacher, admin, or superAdmin
          if (this.role === "student") {
            return true; // Allow students without emails
          }
          return !!email; // Require email for other roles
        },
        message: "Email is required for teachers, admins, and superAdmin",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    contactNumber: {
      // Add the contact number field
      type: String,
      trim: true,
    },
    avatarUrl: {
      // Add the avatar URL field
      type: String,
      // default: null, // Default value if no avatar is uploaded
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true, // Can deactivate users if needed
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    // Optional fields for scalability
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Pre-save hook for hashing password before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add method to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(enteredPassword, this.password);

  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

// Ensure there can only be one superAdmin in the system
userSchema.pre("save", async function (next) {
  if (this.role === "superAdmin") {
    const superAdminExists = await this.constructor.findOne({
      role: "superAdmin",
    });
    if (
      superAdminExists &&
      superAdminExists._id.toString() !== this._id.toString()
    ) {
      throw new Error("There can only be one superAdmin in the system.");
    }
  }
  next();
});

export const User = mongoose.model("User", userSchema);
