import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (value) {
        // Allow endDate to be undefined for daily recurring events
        if (this.isRecurring && this.recurringType === "daily") {
          return value === undefined;
        }
        return value !== undefined; // Otherwise, endDate must be defined
      },
      message:
        "endDate is required unless the event is a daily recurring event.",
    },
  },
  description: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    enum: [
      "Academic Coordinator",
      "Sports Coordinator",
      "Exam Coordinator",
      "Community and Social Events Coordinator",
    ],
    required: true,
  },
  type: {
    type: String,
    enum: [
      "Academic",
      "Sports",
      "Extracurricular",
      "Community and Social Events",
    ],
    required: true,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringType: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: function () {
      return this.isRecurring;
    },
  },
  recurringCount: {
    type: Number,
    required: function () {
      return this.isRecurring;
    },
    min: 1,
    validate: {
      validator: function (count) {
        if (this.recurringType === "daily") return count <= 31;
        if (this.recurringType === "weekly") return count <= 5;
        if (this.recurringType === "monthly") return count <= 12;
        return true;
      },
      message: "Invalid number of occurrences for the recurring type",
    },
  },
  recurrenceId: {
    type: String,
    required: function () {
      return this.isRecurring;
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Event = mongoose.model("Event", eventSchema);
