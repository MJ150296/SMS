import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Admin schema
const adminSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference the User model
      required: true,
      unique: true, // One-to-one relationship with the User model
    },
    department: {
      type: String,
      enum: ["Admin Office", "Operations and Facilities", "IT and Technology"],
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true, // Ensures the field is mandatory
      match: [/^\d{10}$/, "Mobile number must be a valid 10-digit number"], // Validates a 10-digit number
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    adminId: {
      type: String,
      unique: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Permanent", "Contract"],
      required: true,
      trim: true,
    },
    accessLevel: {
      type: String,
      enum: ["Standard", "Managerial"],
      required: true,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    employmentDate: {
      type: Date,
      required: true,
      default: Date.now, // When the admin was hired
    },
    lastLogin: {
      type: Date,
      default: null, // Tracks the last login date
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for additional logic before saving, if necessary
adminSchema.pre("save", async function (next) {
  // Example: Add any pre-save logic here (e.g., notification, verification)
  next();
});

// Virtual field to access the admin's profile picture from the User model (if needed)
adminSchema.virtual("profilePicture").get(function () {
  return this.userId.avatarUrl; // Fetches avatar from linked User model
});

// Create and export the Admin model
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
