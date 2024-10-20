import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    subjects: [
      {
        name: String,
        maxMarks: Number,
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
      },
    ],
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
