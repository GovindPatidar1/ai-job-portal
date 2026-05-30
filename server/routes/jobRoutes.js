const express = require('express');
const router = express.Router();
const {
  createJob, getAllJobs, getJobById, updateJob, deleteJob, applyToJob, getMyJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllJobs);
router.get('/my-jobs', protect, authorize('employer', 'admin'), getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('employer', 'admin'), createJob);
router.put('/:id', protect, authorize('employer', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);
router.post('/:id/apply', protect, authorize('jobseeker'), applyToJob);

module.exports = router;
