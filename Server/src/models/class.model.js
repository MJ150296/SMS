import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    subjects: [
      {
        name: String,
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
      },
    ],
    academicYear: {
      type: String, // e.g., "2023-2024"
      required: true,
    },
  },
  { timestamps: true }
);

export const Class = mongoose.model("Class", classSchema);
