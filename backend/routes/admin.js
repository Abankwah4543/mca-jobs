const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MCAProfile = require('../models/MCAProfile');
const EmployerProfile = require('../models/EmployerProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMCAs = await User.countDocuments({ role: 'mca' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const pendingJobs = await Job.countDocuments({ status: 'pending_approval' });
    const totalApplications = await Application.countDocuments();
    const pendingApprovals = await User.countDocuments({ isApproved: false });
    const revenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalMCAs,
          totalEmployers,
          activeJobs,
          pendingJobs,
          totalApplications,
          pendingApprovals,
          totalRevenue: revenue[0]?.total || 0
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: { users }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Approve/Reject user
// @route   PUT /api/admin/users/:id/approve
// @access  Private/Admin
router.put('/users/:id/approve', async (req, res) => {
  try {
    const { isApproved, isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved, isBlocked },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isApproved ? 'approved' : isBlocked ? 'blocked' : 'updated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Verify MCA PIN
// @route   PUT /api/admin/mca/:id/verify-pin
// @access  Private/Admin
router.put('/mca/:id/verify-pin', async (req, res) => {
  try {
    const mcaProfile = await MCAProfile.findByIdAndUpdate(
      req.params.id,
      { mcPinVerified: true },
      { new: true }
    );

    if (!mcaProfile) {
      return res.status(404).json({
        success: false,
        message: 'MCA profile not found'
      });
    }

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

// @desc    Verify employer license
// @route   PUT /api/admin/employer/:id/verify-license
// @access  Private/Admin
router.put('/employer/:id/verify-license', async (req, res) => {
  try {
    const employerProfile = await EmployerProfile.findByIdAndUpdate(
      req.params.id,
      { licenseVerified: true },
      { new: true }
    );

    if (!employerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found'
      });
    }

    // Also approve the user
    await User.findByIdAndUpdate(employerProfile.user, { isApproved: true });

    res.json({
      success: true,
      message: 'License verified successfully',
      data: { profile: employerProfile }
    });
  } catch (error) {
    console.error('Verify license error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Approve/Reject job
// @route   PUT /api/admin/jobs/:id/status
// @access  Private/Admin
router.put('/jobs/:id/status', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const updateData = { 
      status,
      approvedBy: req.user.id,
      approvedAt: new Date()
    };

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('employer');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: `Job ${status} successfully`,
      data: { job }
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'email profile')
      .sort('-createdAt')
      .limit(50);

    res.json({
      success: true,
      count: payments.length,
      data: { payments }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete associated profiles
    await MCAProfile.deleteOne({ user: req.params.id });
    await EmployerProfile.deleteOne({ user: req.params.id });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
