const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmployerProfile',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  requirements: [String],
  responsibilities: [String],
  category: {
    type: String,
    enum: ['sales', 'marketing', 'pharmacy_technician', 'manager', 'representative', 'other'],
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    remote: {
      type: Boolean,
      default: false
    }
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'GHS'
    },
    period: {
      type: String,
      enum: ['monthly', 'yearly', 'negotiable'],
      default: 'monthly'
    },
    display: {
      type: Boolean,
      default: true
    }
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    required: true
  },
  vacancies: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'active', 'paused', 'closed', 'rejected'],
    default: 'pending_approval'
  },
  rejectionReason: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  paymentReference: String,
  hasPaid: {
    type: Boolean,
    default: false
  },
  expiresAt: Date,
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  skills: [String],
  benefits: [String]
}, {
  timestamps: true
});

// Index for search
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ category: 1, location: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
