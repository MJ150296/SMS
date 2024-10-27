import mongoose from "mongoose";

const attendancePolicySchema = new mongoose.Schema({
  requiredAttendancePercentage: { 
    type: Number, 
    default: 75 
  },
  lateGracePeriod: { 
    type: Number, 
    default: 10 // in minutes
  },
  allowedExcusedAbsences: { 
    type: Number, 
    default: 5 
  },
}, { timestamps: true });

// module.exports = mongoose.model("AttendancePolicy", attendancePolicySchema);

export const AttendancePolicy = mongoose.model("AttendancePolicy", attendancePolicySchema);

