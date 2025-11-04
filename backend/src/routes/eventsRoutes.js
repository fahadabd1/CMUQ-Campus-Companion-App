const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// GET /api/events/upcoming - Get upcoming events
router.get('/upcoming', eventsController.getUpcoming);

// GET /api/events/today - Get today's events
router.get('/today', eventsController.getToday);

// GET /api/events/range - Get events by date range
router.get('/range', eventsController.getByDateRange);

// GET /api/events/category/:category - Get events by category
router.get('/category/:category', eventsController.getByCategory);

// GET /api/events/:id - Get event by ID
router.get('/:id', eventsController.getById);

module.exports = router;
