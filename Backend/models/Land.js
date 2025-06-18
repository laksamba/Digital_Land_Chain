const landSchema = new mongoose.Schema({
  landId: {
    type: String, // Comes from blockchain
    unique: true,
    default: null
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  area: {
    type: Number,
    required: true
  },

  // 📁 Temporary document paths (before verification)
  tempDocuments: [{
    type: String, // Local/S3 path
  }],

  // 📦 Documents uploaded to IPFS (after verification)
  ipfsDocuments: [{
    type: String, // IPFS CID
  }],

  // 📦 Optional: JSON metadata of the land uploaded to IPFS
  ipfsLandMeta: {
    type: String // IPFS CID of JSON metadata
  },

  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
