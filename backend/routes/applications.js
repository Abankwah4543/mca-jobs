const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const MCAProfile = require('../models/MCAProfile');
const { protect, requireApproval } = require('../middleware/auth');

router.use(protect);
router.use(requireApproval);

// @desc    Submit application
// @route   POST /api/applications
// @access  Private/MCA
router.post('/', async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    const mcaProfile = await MCAProfile.findOne({ user: req.user.id });
    
    if (!mcaProfile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your MCA profile first'
      });
    }

    // Check if already applied
    const existing = await Application.findOne({
      job: jobId,
      applicant: mcaProfile._id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: mcaProfile._id,
      coverLetter
    });

    // Increment applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get my applications
// @route   GET /api/applications/my-applications
// @access  Private/MCA
router.get('/my-applications', async (req, res) => {
  try {
    const mcaProfile = await MCAProfile.findOne({ user: req.user.id });

    if (!mcaProfile) {
      return res.status(404).json({
        success: false,
        message: 'MCA profile not found'
      });
    }

    const applications = await Application.find({ applicant: mcaProfile._id })
      .populate('job')
      .sort('-createdAt');

    res.json({
      success: true,
      count: applications.length,
      data: { applications }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update application status (Employer only)
// @route   PUT /api/applications/:id/status
// @access  Private/Employer
router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    if (notes) application.employerNotes = notes;

    if (status === 'viewed') application.viewedAt = new Date();
    if (status === 'shortlisted') application.shortlistedAt = new Date();
    if (status === 'rejected') application.rejectedAt = new Date();

    await application.save();

    res.json({
      success: true,
      message: 'Application status updated',
      data: { application }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private/MCA
router.delete('/:id', async (req, res) => {
  try {
    const mcaProfile = await MCAProfile.findOne({ user: req.user.id });

    const application = await Application.findOne({
      _id: req.params.id,
      applicant: mcaProfile._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = 'withdrawn';
    application.withdrawnAt = new Date();
    application.withdrawalReason = req.body.reason || 'No longer interested';
    
    await application.save();

    res.json({
      success: true,
      message: 'Application withdrawn'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
