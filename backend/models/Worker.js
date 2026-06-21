const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  skills: [{ type: String }],
  experience: { type: Number, default: 0 },
  location: { type: String, default: '' },
  city: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  profileImage: { type: String, default: '' },
  bio: { type: String, default: '' },
  hourlyRate: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  totalEarnings: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);
