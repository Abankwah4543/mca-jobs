const express = require('express');
const router = express.Router();
const EmployerProfile = require('../models/EmployerProfile');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.use(authorize('employer'));

// @desc    Get my employer profile
// @route   GET /api/employer/profile
// @access  Private/Employer
router.get('/profile', async (req, res) => {
  try {
    const employerProfile = await EmployerProfile.findOne({ user: req.user.id })
      .populate('user', 'email profile');

    if (!employerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found'
      });
    }

    res.json({
      success: true,
      data: { profile: employerProfile }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update employer profile
// @route   PUT /api/employer/profile
// @access  Private/Employer
router.put('/profile', async (req, res) => {
  try {
    let employerProfile = await EmployerProfile.findOne({ user: req.user.id });

    if (!employerProfile) {
      employerProfile = await EmployerProfile.create({ 
        user: req.user.id,
        ...req.body 
      });
    } else {
      employerProfile = await EmployerProfile.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Employer profile updated successfully',
      data: { profile: employerProfile }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Upload license document
// @route   POST /api/employer/license
// @access  Private/Employer
router.post('/license', upload.single('license'), async (req, res) => {
  try {
    const employerProfile = await EmployerProfile.findOne({ user: req.user.id });

    if (!employerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found'
      });
    }

    if (req.file) {
      employerProfile.licenseDocument = {
        filename: req.file.filename,
        path: req.file.path,
        uploadedAt: new Date()
      };
    }

    if (req.body.licenseNumber) {
      employerProfile.licenseNumber = req.body.licenseNumber;
    }

    employerProfile.licenseVerified = false; // Reset verification on update
    await employerProfile.save();

    res.json({
      success: true,
      message: 'License document uploaded. Pending admin verification.',
      data: { profile: employerProfile }
    });
  } catch (error) {
    console.error('Upload license error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
