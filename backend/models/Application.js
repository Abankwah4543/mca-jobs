const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCAProfile',
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'viewed', 'shortlisted', 'rejected', 'interview_scheduled', 'hired', 'withdrawn'],
    default: 'submitted'
  },
  coverLetter: String,
  resumeVersion: String,
  appliedDocuments: [{
    type: String,
    ref: 'MCAProfile.documents'
  }],
  employerNotes: String,
  viewedAt: Date,
  shortlistedAt: Date,
  rejectedAt: Date,
  rejectionReason: String,
  hiredAt: Date,
  withdrawnAt: Date,
  withdrawalReason: String
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
