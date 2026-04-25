const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyType: {
    type: String,
    enum: ['pharmacy', 'pharmaceutical_company', 'distributor', 'hospital', 'clinic'],
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  licenseVerified: {
    type: Boolean,
    default: false
  },
  licenseDocument: {
    filename: String,
    path: String,
    uploadedAt: Date,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  },
  address: {
    street: String,
    city: String,
    region: String,
    country: {
      type: String,
      default: 'Ghana'
    }
  },
  phone: String,
  website: String,
  description: String,
  industry: String,
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  contactPerson: {
    name: String,
    position: String,
    email: String,
    phone: String
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);
