// models/salary.model.js
import mongoose from "mongoose";

const salaryPaymentSchema = new mongoose.Schema(
  {
    salaryId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    payPeriod: {
      type: String,
      enum: ["monthly", "quarterly"],
      default: "monthly",
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    transactionId: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "cheque", "cash"],
      default: "bank_transfer",
    },
    taxDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
  },
  { timestamps: true }
);

// salaryPaymentSchema.index({ userId: 1, payPeriod: -1 });

// // Index for unique feeId retrieval
// salaryPaymentSchema.index({ salaryId: 1 });


const SalaryPayment = mongoose.model("SalaryPayment", salaryPaymentSchema);
export default SalaryPayment;
