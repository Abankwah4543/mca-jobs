const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmployerProfile',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCAProfile',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 60,
    comment: 'Duration in minutes'
  },
  location: {
    type: String,
    enum: ['in-person', 'video_call', 'phone_call'],
    default: 'in-person'
  },
  address: String,
  meetingLink: String,
  phoneNumber: String,
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled'],
    default: 'scheduled'
  },
  notes: String,
  employerFeedback: String,
  applicantFeedback: String,
  rescheduledFrom: {
    date: Date,
    time: String,
    reason: String
  },
  cancelledAt: Date,
  cancelReason: String,
  remindersSent: [{
    type: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);
