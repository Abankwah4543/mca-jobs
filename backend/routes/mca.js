const express = require('express');
const router = express.Router();
const MCAProfile = require('../models/MCAProfile');
const User = require('../models/User');
const { protect, requireApproval, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.use(requireApproval);

// @desc    Get my profile
// @route   GET /api/mca/profile
// @access  Private/MCA
router.get('/profile', async (req, res) => {
  try {
    const mcaProfile = await MCAProfile.findOne({ user: req.user.id })
      .populate('user', 'email profile');

    if (!mcaProfile) {
      return res.status(404).json({
        success: false,
        message: 'MCA profile not found'
      });
    }

    res.json({
      success: true,
      data: { profile: mcaProfile }
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

// @desc    Update profile
// @route   PUT /api/mca/profile
// @access  Private/MCA
router.put('/profile', async (req, res) => {
  try {
    let mcaProfile = await MCAProfile.findOne({ user: req.user.id });

    if (!mcaProfile) {
      mcaProfile = await MCAProfile.create({ 
        user: req.user.id,
        ...req.body 
      });
    } else {
      mcaProfile = await MCAProfile.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile: mcaProfile }
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

// @desc    Upload documents
// @route   POST /api/mca/documents
// @access  Private/MCA
router.post('/documents', upload.array('documents', 5), async (req, res) => {
  try {
    const mcaProfile = await MCAProfile.findOne({ user: req.user.id });

    if (!mcaProfile) {
      return res.status(404).json({
        success: false,
        message: 'MCA profile not found'
      });
    }

    const documents = req.files.map(file => ({
      type: req.body.type || 'other',
      filename: file.filename,
      path: file.path
    }));

    mcaProfile.documents.push(...documents);
    await mcaProfile.save();

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      data: { documents }
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Verify MC PIN
// @route   POST /api/mca/verify-pin
// @access  Private/MCA
router.post('/verify-pin', async (req, res) => {
  try {
    const { mcPin } = req.body;

    if (!mcPin) {
      return res.status(400).json({
        success: false,
        message: 'MC PIN is required'
      });
    }

    // Check if PIN already exists
    const existing = await MCAProfile.findOne({ mcPin });
    
    if (existing && existing.user.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'This MC PIN is already registered to another account'
      });
    }

    const mcaProfile = await MCAProfile.findOneAndUpdate(
      { user: req.user.id },
      { 
        mcPin,
        mcPinVerified: true 
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'MC PIN verified successfully',
      data: { profile: mcaProfile }
    });
  } catch (error) {
    console.error('Verify PIN error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
