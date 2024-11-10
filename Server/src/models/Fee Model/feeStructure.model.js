import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the Fee Structure schema
const feeStructureSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the SuperAdmin user who sets up the fee
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      enum: ["Science", "Arts", "Commerce"],
      trim: true,
    },
    baseTuitionFee: {
      type: Number,
      required: true,
      min: 0,
    },
    transportationFee: {
      distanceZone: {
        type: String,
        required: false,
        trim: true,
      },
      oneWayFee: { type: Number, min: 0 },
      roundTripFee: { type: Number, min: 0 },
    },
    hostelFee: {
      roomType: {
        type: String,
        enum: ["Single", "Double", "Dormitory"],
        required: false,
      },
      boardingOption: {
        type: String,
        enum: ["Full-time", "Weekday", "Weekend"],
      },
      mealPlan: {
        type: String,
        enum: ["Standard", "Premium"],
      },
      feeAmount: { type: Number, min: 0 },
    },
    labFees: {
      type: Number,
      min: 0, // e.g., {'Physics': 1000, 'Chemistry': 1200}
    },
    extracurricularFees: {
      type: Number, // e.g., {'Sports': 500, 'Music': 800}
      min: 0,
    },
    libraryFee: {
      type: Number,
      min: 0,
    },
    examFees: {
      type: Number,
      min: 0,
    },
    uniformFee: {
      type: Number,
      min: 0,
    },
    digitalResourcesFee: {
      type: Number,
      min: 0,
    },
    sportsFacilityFee: {
      type: Number,
      min: 0,
    },
    medicalServiceFee: {
      type: Number,
      min: 0,
    },
    counselingFee: {
      type: Number,
      min: 0,
    },
    concessions: {
      siblingDiscount: { type: Number, min: 0 },
      incomeBasedDiscount: { type: Number, min: 0 },
      meritScholarship: { type: Number, min: 0 },
    },
    eventFees: {
      type: Number, // e.g., {'Field Trip': 1500, 'Camp': 3000}
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for any logic before saving, if necessary
feeStructureSchema.pre("save", async function (next) {
  // Example: Validate fee values or apply any pre-save logic
  next();
});

// Create and export the Fee Structure model
const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
export default FeeStructure;
