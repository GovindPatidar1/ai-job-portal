const express = require('express');
const router = express.Router();
const {
  uploadResume, getRecommendations, generateCoverLetter, skillGapAnalysis, chatbot,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/resume/upload', protect, upload.single('resume'), uploadResume);
router.get('/recommendations', protect, getRecommendations);
router.post('/cover-letter', protect, generateCoverLetter);
router.post('/skill-gap', protect, skillGapAnalysis);
router.post('/chatbot', chatbot);

module.exports = router;
