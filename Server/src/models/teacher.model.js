import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    teacherId: {
      type: String,
      unique: true,
      required: true,
    },
    subjectSpecialization: {
      type: [String], // Array of subjects the teacher handles
      required: true,
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

export const Teacher = mongoose.model("Teacher", teacherSchema);
