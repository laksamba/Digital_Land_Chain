// models/Transfer.js
import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
  landId: {
    type: String, // Matches blockchain land ID
    required: true,
  },
  fromUser: {
    type: String, // Wallet address of sender
    required: true,
  },
  toUser: {
    type: String, // Wallet address of recipient
    required: true,
  },
  transactionHash: {
    type: String, // Blockchain transaction hash
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
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

export default mongoose.model('Transfer', transferSchema);
