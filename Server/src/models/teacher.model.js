import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Teacher schema
const teacherSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
      unique: true, // One-to-one relationship with the User model
    },
    teacherId: {
      type: String,
      unique: true,
    },
    subjectSpecialization: {
      type: [String], // Array of subjects the teacher handles
      required: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    lastLogin: {
      type: Date,
      default: null, // Tracks the last login date
    },
    employmentDate: {
      type: Date,
      default: Date.now,
    },
    classAssignments: [
      {
        classId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
        },
        subject: String,
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook for additional logic before saving, if necessary
teacherSchema.pre("save", async function (next) {
  // Example: Add any pre-save logic here (e.g., validation, logging)
  next();
});

// Virtual field to access the teacher's profile picture from the User model (if needed)
teacherSchema.virtual("profilePicture").get(function () {
  return this.userId.avatarUrl; // Fetches avatar from linked User model
});

// Create and export the Teacher model
const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
