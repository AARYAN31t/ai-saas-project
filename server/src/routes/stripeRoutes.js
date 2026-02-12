const express = require('express');
const { createCheckoutSession, handleWebhook } = require('../controllers/stripeController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
