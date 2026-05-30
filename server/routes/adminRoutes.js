const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, toggleUserStatus, deleteJob, getAllApplications,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/jobs/:id', deleteJob);
router.get('/applications', getAllApplications);

module.exports = router;
