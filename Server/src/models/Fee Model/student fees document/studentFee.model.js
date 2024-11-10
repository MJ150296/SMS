import mongoose from "mongoose";
const { Schema } = mongoose;

const feeSchema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  academicYear: { type: String, required: true },
  department: {
    type: String,
    enum: ["Science", "Arts", "Commerce", "Unknown"],
    required: true,
  },
  baseTuitionFee: { type: Number, min: 0, required: true },
  transportationFee: { type: Number, min: 0, default: 0 },
  hostelFee: { type: Number, min: 0, default: 0 },
  labFees: { type: Number, min: 0, default: 0 },
  extracurricularFees: { type: Number, min: 0, default: 0 },
  libraryFee: { type: Number, min: 0, default: 0 },
  examFees: { type: Number, min: 0, default: 0 },
  uniformFee: { type: Number, min: 0, default: 0 },
  digitalResourcesFee: { type: Number, min: 0, default: 0 },
  sportsFacilityFee: { type: Number, min: 0, default: 0 },
  medicalServiceFee: { type: Number, min: 0, default: 0 },
  counselingFee: { type: Number, min: 0, default: 0 },

  concessions: {
    siblingDiscount: { type: Number, min: 0, default: 0 },
    incomeBasedDiscount: { type: Number, min: 0, default: 0 },
    meritScholarship: { type: Number, min: 0, default: 0 },
  },

  eventFees: { type: Number, min: 0, default: 0 },

  // Optional fields for tracking updates
  lastUpdated: { type: Date, default: Date.now },
});

const StudentFee = mongoose.model("studentFee", feeSchema);
export default StudentFee;
