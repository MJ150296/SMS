import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    submitterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "approved_leave"],
      required: true,
    },
    notes: {
      type: String,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      validate: {
        validator: function () {
          return this.role !== "student" || !!this.classId;
        },
        message: "classId is required for students.",
      },
    },
    approvedLeave: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("AttendanceRecord", attendanceRecordSchema);

export const AttendanceRecord = mongoose.model(
  "AttendanceRecord",
  attendanceRecordSchema
);
