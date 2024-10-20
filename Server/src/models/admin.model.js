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
    school: {
      type: Schema.Types.ObjectId,
      ref: "School", // Link the admin to a specific school
      required: true,
    },
    department: {
      type: String, // Department the admin is responsible for (optional)
      trim: true,
      maxlength: [100, "Department name cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10,15}$/, "Please provide a valid phone number"], // Ensure phone number is valid
      required: [true, "Phone number is required for admin"],
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
