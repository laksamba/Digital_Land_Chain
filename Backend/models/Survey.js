// models/Survey.js
import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema({
  landId: {
    type: String, // Matches blockchain land ID
    required: true,
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  surveyOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending',
  },
  surveyDetails: {
    type: String, // Description or report of survey findings
  },
  documents: [{
    type: String, // URLs to survey-related documents
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Survey', surveySchema);