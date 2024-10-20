import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      maxlength: [100, 'School name cannot be more than 100 characters'],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String },
    },
    contactNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{10,15}$/, 'Please add a valid contact number'],
    },
    email: {
      type: String,
      required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(:\d+)?(\/[\w\d-]*)*\/?$/,
        'Please add a valid URL',
      ],
    },
    establishedYear: {
      type: Number,
      min: [1800, 'Year must be after 1800'],
      max: [new Date().getFullYear(), 'Year cannot be in the future'],
    },
    principal: {
      fullName: { type: String, required: true },
      contactNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
    schoolType: {
      type: String,
      enum: ['Public', 'Private', 'International'],
      required: true,
    },
    affiliatedBoard: {
      type: String,
      required: true,
      enum: ['CBSE', 'ICSE', 'State Board', 'IB', 'Others'], // Can add more
    },
    logoUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const School = mongoose.model('School', schoolSchema);
