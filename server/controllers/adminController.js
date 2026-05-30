const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications, recentUsers, recentJobs] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt isActive'),
      Job.find().sort({ createdAt: -1 }).limit(5).populate('postedBy', 'name'),
    ]);

    const jobSeekers = await User.countDocuments({ role: 'jobseeker' });
    const employers = await User.countDocuments({ role: 'employer' });
    const activeJobs = await Job.countDocuments({ isActive: true });

    res.json({
      stats: { totalUsers, totalJobs, totalApplications, jobSeekers, employers, activeJobs },
      recentUsers,
      recentJobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot deactivate admin' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted by admin' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
