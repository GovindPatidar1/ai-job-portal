const gemini = require('../services/geminiService');
const resumeService = require('../services/resumeService');
const User = require('../models/User');
const Job = require('../models/Job');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const buffer = req.file.buffer;
    const [parsed, uploaded] = await Promise.all([
      resumeService.parseResume(buffer),
      resumeService.uploadResumeToCloud(buffer, req.user._id),
    ]);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: { url: uploaded.url, publicId: uploaded.publicId, parsedData: parsed } },
      { new: true }
    ).select('-password');

    res.json({ message: 'Resume uploaded and parsed successfully', resume: user.resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const skills = user.resume?.parsedData?.skills || [];

    if (skills.length === 0)
      return res.status(400).json({ message: 'Please upload your resume first to get recommendations' });

    const jobs = await Job.find({ isActive: true }).limit(50);
    const recommendations = await gemini.getJobRecommendations(skills, jobs);

    // Populate full job details
    const jobIds = recommendations.map((r) => r.jobId);
    const jobDetails = await Job.find({ _id: { $in: jobIds } }).populate('postedBy', 'name');

    const enriched = recommendations.map((rec) => ({
      ...rec,
      job: jobDetails.find((j) => j._id.toString() === rec.jobId),
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateCoverLetter = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

    const [job, user] = await Promise.all([
      Job.findById(jobId),
      User.findById(req.user._id),
    ]);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    const coverLetter = await gemini.generateCoverLetter(
      job.title,
      job.company,
      user.resume?.parsedData?.skills || [],
      user.resume?.parsedData?.experience?.join('. ') || ''
    );

    res.json({ coverLetter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.skillGapAnalysis = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

    const [job, user] = await Promise.all([
      Job.findById(jobId),
      User.findById(req.user._id),
    ]);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    const analysis = await gemini.analyzeSkillGap(
      user.resume?.parsedData?.skills || [],
      job.skills
    );

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.chatbot = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const reply = await gemini.chatbotReply(message, history || []);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
