const mongoose = require('mongoose');

const mcaProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  mcPin: {
    type: String,
    unique: true,
    sparse: true
  },
  mcPinVerified: {
    type: Boolean,
    default: false
  },
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    graduationYear: Number
  }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    certificateNumber: String
  }],
  skills: [String],
  location: {
    city: String,
    region: String,
    country: {
      type: String,
      default: 'Ghana'
    }
  },
  availability: {
    type: String,
    enum: ['immediately', '2weeks', '1month', 'not_available'],
    default: 'immediately'
  },
  expectedSalary: {
    amount: Number,
    currency: {
      type: String,
      default: 'GHS'
    },
    period: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    }
  },
  documents: [{
    type: {
      type: String,
      enum: ['cv', 'certificate', 'id', 'other']
    },
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MCAProfile', mcaProfileSchema);
