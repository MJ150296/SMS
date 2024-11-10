import mongoose from "mongoose";
const { Schema } = mongoose;

const teacherSalarySchema = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
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
      medicalAllowance: { type: Number, min: 0, default: 0 },
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
      performanceBonus: { type: Number, min: 0, default: 0 },
      festivalBonus: { type: Number, min: 0, default: 0 },
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

// Calculate total payable before saving
// teacherSalarySchema.pre("save", function (next) {
//   const allowancesTotal = Object.values(this.allowances).reduce(
//     (acc, curr) => acc + (curr.amount || curr),
//     0
//   );
//   const deductionsTotal = Object.values(this.deductions).reduce(
//     (acc, curr) => acc + (curr.amount || curr),
//     0
//   );
//   const bonusesTotal = Object.values(this.bonuses).reduce(
//     (acc, curr) => acc + (curr.amount || curr),
//     0
//   );
//   this.totalPayable =
//     this.baseSalary + allowancesTotal + bonusesTotal - deductionsTotal;
//   next();
// });

const TeacherSalary = mongoose.model("TeacherSalary", teacherSalarySchema);
export default TeacherSalary;
