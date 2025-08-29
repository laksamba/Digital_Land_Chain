
// backend/models/Land.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const DocSchema = new Schema(
  {
    landId: { type: String, required: true, },
    ownerName: { type: String, required: true },
    doc1Url: { type: String },
    doc2Url: { type: String },
    doc3Url: { type: String },
    doc4Url: { type: String },
  },
  { timestamps: true }
);

const Docs = mongoose.model('Document', DocSchema);

export default Docs;
