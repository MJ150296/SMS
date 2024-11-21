import mongoose, { Schema } from "mongoose";

const feePaymentSchema = new Schema(
  {
    feeId: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amount: { type: Number, required: true },
    overDueAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["paid", "unpaid", "overdue"],
      default: "unpaid",
    },
    transactionId: { type: String, default: null },
    paymentMethod: {
      type: String,
      enum: [
        "credit_card",
        "debit_card",
        "net_banking",
        "cash",
        "cheque",
        "UPI",
      ],
      default: "cash",
    },
    receipt: { type: String, default: null }, // URL to receipt or file path
    remarks: { type: String, default: null },
  },
  { timestamps: true }
);

// Compound index for optimized querying by studentId and dueDate
feePaymentSchema.index({ studentId: 1, dueDate: -1 });

// Index for unique feeId retrieval

feePaymentSchema.index({ feeId: 1 });

const FeePayment = mongoose.model("FeePayment", feePaymentSchema);
export default FeePayment;
