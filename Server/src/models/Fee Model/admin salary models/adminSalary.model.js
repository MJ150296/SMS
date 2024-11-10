import mongoose from "mongoose";
const { Schema } = mongoose;

const adminSalarySchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
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
    bonuses: {
      annualBonus: { type: Number, min: 0, default: 0 },
      performanceBonus: { type: Number, min: 0, default: 0 },
      otherBonuses: {
        description: { type: String, trim: true },
        amount: { type: Number, min: 0, default: 0 },
      },
    },
    totalPayable: {
      type: Number,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


const AdminSalary = mongoose.model("AdminSalary", adminSalarySchema);
export default AdminSalary;
