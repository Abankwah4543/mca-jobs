const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'GHS'
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  paystackReference: {
    type: String,
    unique: true
  },
  purpose: {
    type: String,
    enum: ['mca_registration', 'job_posting', 'premium_subscription', 'featured_job'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'mobile_money', 'bank_transfer']
  },
  metadata: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    description: String
  },
  paidAt: Date,
  verifiedAt: Date,
  refundedAt: Date,
  refundReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
