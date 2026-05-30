const express = require('express');
const router = express.Router();
const { getMyApplications, getJobApplications, updateStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyApplications);
router.get('/job/:jobId', protect, authorize('employer', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('employer', 'admin'), updateStatus);

module.exports = router;
