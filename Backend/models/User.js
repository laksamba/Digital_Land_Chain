import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  fullName: {
    english: { type: String, required: true },
    nepali: { type: String },
  },
  documentType: {
    type: String,
    required: true, // e.g., 'citizenship', 'nid', 'passport'
  },
  dateOfBirth: {
    bs: { type: String }, // e.g., "2050-05-15"
    ad: { type: Date },
  },
  citizenshipNumber: {
    type: String,
    unique: true,
    sparse: true,
    required: false,
  },
  citizenshipIssuedDistrict: {
    type: String,
    required: true,
  },
  citizenshipIssuedDate: {
    bs: { type: String },
    ad: { type: Date },
  },

  photo: {
    type: String,
    required: true,
  },

  documents: [
    {
      type: {
        type: String,
        enum: ["citizenship_front", "citizenship_back"],
      },
      url: { type: String, required: true },
    },
  ],

  verificationStatus: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// user schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      "admin",
      "citizen",
      "land_officer",
      "bank_officer",
      "survey_officer",
    ],
    default: "citizen",
    required: true,
  },
  walletAddress: {
    type: String, // Ethereum wallet address for blockchain interaction
    required: true,
    unique: true,
    trim: true,
  },
  kyc: kycSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
