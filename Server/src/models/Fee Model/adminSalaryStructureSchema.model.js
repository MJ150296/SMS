import mongoose from "mongoose";
const { Schema } = mongoose;

const adminSalaryStructureSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the SuperAdmin user who sets up the admin salary structure
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    allowances: {
      houseAllowance: { type: Number, min: 0, default: 0 },
      transportationAllowance: { type: Number, min: 0, default: 0 },
      communicationAllowance: { type: Number, min: 0, default: 0 },
      specialAllowance: { type: Number, min: 0, default: 0 },
      otherAllowances: {
        description: { type: String, trim: true },
        amount: { type: Number, min: 0, default: 0 },
      },
    },
    deductions: {
      taxDeduction: { type: Number, min: 0, default: 0 },
      providentFund: { type: Number, min: 0, default: 0 },
      professionalTax: { type: Number, min: 0, default: 0 },
      otherDeductions: {
        description: { type: String, trim: true },
        amount: { type: Number, min: 0, default: 0 },
      },
    },
    bonus: {
      festivalBonus: { type: Number, min: 0, default: 0 },
      performanceBonus: { type: Number, min: 0, default: 0 },
      otherBonuses: {
        description: { type: String, trim: true },
        amount: { type: Number, min: 0, default: 0 },
      },
    },
    revisionCycle: {
      type: String,
      enum: ["Annual", "Bi-annual", "Quarterly"],
      default: "Annual",
    },
  },
  {
    timestamps: true,
  }
);

const AdminSalaryStructure = mongoose.model(
  "AdminSalaryStructure",
  adminSalaryStructureSchema
);
export default AdminSalaryStructure;
