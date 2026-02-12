const express = require('express');
const multer = require('multer');
const {
    handleChat,
    handleResumeAnalysis,
    handleCollegeQuery,
    handleEmailGeneration,
    handleSummarization,
    getHistory
} = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer(); // For handling PDF uploads in memory

router.post('/chat', protect, handleChat);
router.post('/resume', protect, upload.single('resume'), handleResumeAnalysis);
router.post('/college', protect, handleCollegeQuery);
router.post('/email', protect, handleEmailGeneration);
router.post('/summarize', protect, handleSummarization);
router.get('/history', protect, getHistory);

module.exports = router;
