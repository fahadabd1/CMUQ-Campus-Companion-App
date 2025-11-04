const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Health check
router.get('/health', webhookController.healthCheck);

// Zapier webhook endpoint - receives parsed emails
router.post('/events', webhookController.receiveEvent);

module.exports = router;
