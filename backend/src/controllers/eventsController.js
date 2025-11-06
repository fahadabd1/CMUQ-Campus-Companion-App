const Event = require('../models/Event');

/**
 * Get all upcoming events
 */
exports.getUpcoming = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const events = await Event.getUpcoming(limit);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
};

/**
 * Get today's events
 */
exports.getToday = async (req, res) => {
  try {
    const events = await Event.getToday();

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching today\'s events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch today\'s events'
    });
  }
};

/**
 * Get events by date range
 */
exports.getByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'start_date and end_date are required'
      });
    }

    const events = await Event.getByDateRange(start_date, end_date);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
};

/**
 * Get event by ID
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.getById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
};

/**
 * Get events by category
 */
exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Accept any category from email (no validation)
    // This allows categories like "Fun", "Academic", etc.

    const events = await Event.getByCategory(category);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
};
