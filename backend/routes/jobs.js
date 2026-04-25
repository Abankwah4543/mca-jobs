const express = require('express');
const router = express.Router();
const { 
  getJobs, 
  getJob, 
  createJob, 
  updateJob, 
  deleteJob, 
  getMyJobs,
  getApplicants 
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.use(protect);

router.route('/')
  .get(getJobs)
  .post(authorize('employer'), createJob);

router.get('/my-jobs', authorize('employer'), getMyJobs);
router.get('/:id/applicants', authorize('employer'), getApplicants);

router.route('/:id')
  .put(authorize('employer'), updateJob)
  .delete(authorize('employer'), deleteJob);

module.exports = router;
