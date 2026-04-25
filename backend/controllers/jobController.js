const Job = require('../models/Job');
const Application = require('../models/Application');
const EmployerProfile = require('../models/EmployerProfile');

// @desc    Get all jobs (with filters)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { 
      category, location, region, employmentType, 
      experienceLevel, search, status, minSalary, maxSalary 
    } = req.query;

    const query = { status: 'active' };

    if (category) query.category = category;
    if (employmentType) query.employmentType = employmentType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    
    if (location) query['location.city'] = location;
    if (region) query['location.region'] = region;
    
    if (search) {
      query.$text = { $search: search };
    }

    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.min = { $gte: parseInt(minSalary) };
      if (maxSalary) query.salary.max = { $lte: parseInt(maxSalary) };
    }

    const jobs = await Job.find(query)
      .populate('employer', 'companyName companyType')
      .sort('-createdAt')
      .limit(50);

    res.json({
      success: true,
      count: jobs.length,
      data: { jobs }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'companyName companyType description website address');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private/Employer
exports.createJob = async (req, res) => {
  try {
    const employerProfile = await EmployerProfile.findOne({ user: req.user.id });

    if (!employerProfile) {
      return res.status(400).json({
        success: false,
        message: 'Employer profile not found. Please complete your profile first.'
      });
    }

    if (!employerProfile.licenseVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your license is pending verification. You cannot post jobs yet.'
      });
    }

    req.body.employer = employerProfile._id;
    req.body.status = 'pending_approval';

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Job created successfully. Pending admin approval.',
      data: { job }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
exports.updateJob = async (req, res) => {
  try {
    const employerProfile = await EmployerProfile.findOne({ user: req.user.id });
    
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns this job
    if (job.employer.toString() !== employerProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
exports.deleteJob = async (req, res) => {
  try {
    const employerProfile = await EmployerProfile.findOne({ user: req.user.id });
    
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== employerProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private/Employer
exports.getMyJobs = async (req, res) => {
  try {
    const employerProfile = await EmployerProfile.findOne({ user: req.user.id });

    if (!employerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found'
      });
    }

    const jobs = await Job.find({ employer: employerProfile._id })
      .sort('-createdAt');

    res.json({
      success: true,
      count: jobs.length,
      data: { jobs }
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get job applicants
// @route   GET /api/jobs/:id/applicants
// @access  Private/Employer
exports.getApplicants = async (req, res) => {
  try {
    const employerProfile = await EmployerProfile.findOne({ user: req.user.id });
    
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== employerProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants for this job'
      });
    }

    const applications = await Application.find({ job: job._id })
      .populate('applicant')
      .populate('applicant.user')
      .sort('-createdAt');

    res.json({
      success: true,
      count: applications.length,
      data: { applications }
    });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
