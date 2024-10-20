import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    studentId: {
      type: String,
      unique: true,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    parentContact: {
      father: {
        name: String,
        phone: String,
        email: {
          type: String,
          match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
            "Please add a valid email address",
          ],
          required: false, // Email is optional
        },
      },
      mother: {
        name: String,
        phone: String,
        email: {
          type: String,
          match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
            "Please add a valid email address",
          ],
          required: false, // Email is optional
        },
      },
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    attendanceRecords: [
      {
        date: Date,
        status: {
          type: String,
          enum: ["Present", "Absent", "Late", "Excused"],
          default: "Present",
        },
      },
    ],
    performance: {
      grades: [
        {
          subject: String,
          grade: String,
          remarks: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
