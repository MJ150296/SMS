import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Student schema
const studentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
      unique: true, // One-to-one relationship with the User model
    },
    studentId: {
      type: String,
      unique: true,
      required: true,
    },
    classEnrolled: {
      type: Schema.Types.ObjectId,
      ref: "Class", // Reference to the Class model
      required: true,
    },
    section: {
      type: String, // default A is coming from userRegister.controller.js
      required: true,
    },
    rollNumber: {
      type: Number, // Unique identifier for the student in the class
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    guardianDetails: {
      fatherName: { type: String, trim: true },
      motherName: { type: String, trim: true },
      contactNumber: {
        type: String,
        trim: true,
        match: [/^\d{10,15}$/, "Please provide a valid contact number"],
      },
      address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true },
      },
    },
    admissionDate: {
      type: Date,
      default: Date.now, // Date of admission
    },
    lastLogin: {
      type: Date, // Track student's last login
      default: null,
    },
  },
  { timestamps: true }
);

// Compound unique index on classEnrolled and rollNumber
studentSchema.index(
  { classEnrolled: 1, section: 1, rollNumber: 1 },
  { unique: true }
);

// Pre-save hook for additional logic before saving, if necessary
studentSchema.pre("save", async function (next) {
  // Example: Add any pre-save logic here (e.g., validation, logging)
  next();
});

// Virtual field to access the student's profile picture from the User model (if needed)
studentSchema.virtual("profilePicture").get(function () {
  return this.userId.avatarUrl; // Fetches avatar from linked User model
});

// Create and export the Student model
const Student = mongoose.model("Student", studentSchema);
export default Student;
