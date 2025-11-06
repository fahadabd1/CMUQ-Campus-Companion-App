const Event = require('../models/Event');

/**
 * Webhook endpoint to receive parsed emails from Zapier
 * Zapier will POST data in this format:
 * {
 *   "eventname": "Tech Talk on AI",
 *   "eventdate": "November 15, 2025",
 *   "eventime": "3:00 PM - 5:00 PM",
 *   "eventlocation": "Building 2, Room 2301",
 *   "eventcategory": "Academic",
 *   "eventdescription": "Join us for an exciting talk..."
 * }
 */
exports.receiveEvent = async (req, res) => {
  try {
    console.log('📧 Received webhook from Zapier:', req.body);

    const {
      eventname,
      eventdate,
      eventime,
      eventtime,
      eventlocation,
      eventcategory,
      eventdescription,
      eventlink,
      // Fallback to old field names for backward compatibility
      event_title,
      title,
      date,
      start_time,
      end_time,
      time,
      location,
      category,
      description,
      link
    } = req.body;

    // Extract event title (try new format first, then fallback)
    const eventTitle = eventname || event_title || title;
    if (!eventTitle) {
      return res.status(400).json({
        success: false,
        error: 'Event title is required (eventname field is missing)'
      });
    }

    // Extract date and time (try new format first, then fallback)
    const eventDateStr = eventdate || date;
    const eventTimeStr = eventime || eventtime || time;

    // Parse date and time
    let startDateTime, endDateTime;

    try {
      if (start_time && end_time) {
        // If Zapier sends separate start_time and end_time
        startDateTime = new Date(start_time);
        endDateTime = new Date(end_time);
      } else if (eventDateStr && eventTimeStr) {
        // Parse combined date and time
        startDateTime = parseDateAndTime(eventDateStr, eventTimeStr);
        endDateTime = parseEndTime(eventDateStr, eventTimeStr);
      } else {
        throw new Error('Date and time information missing');
      }
    } catch (parseError) {
      console.error('Date parsing error:', parseError);
      return res.status(400).json({
        success: false,
        error: 'Invalid date/time format',
        details: parseError.message
      });
    }

    // Extract other fields
    const eventLoc = eventlocation || location || 'TBD';
    const eventCat = eventcategory || category || 'Other';
    const eventDesc = eventdescription || description || '';
    const eventLink = eventlink || link || null;

    // Use category directly from email (no normalization)
    // This allows any category like "Fun", "Academic", etc.

    // Create event in database
    const newEvent = await Event.create({
      title: eventTitle,
      description: eventDesc,
      category: eventCat,
      location: eventLoc,
      start_time: startDateTime,
      end_time: endDateTime,
      link: eventLink,
      source: 'email',
      raw_email_data: JSON.stringify(req.body)
    });

    console.log('✓ Event created:', newEvent.id, '-', eventTitle);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: newEvent.id,
        title: newEvent.title,
        date: newEvent.start_time,
        location: newEvent.location,
        category: newEvent.category
      }
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process event',
      details: error.message
    });
  }
};

/**
 * Parse date and time strings into Date object
 * Handles formats like: "November 15, 2025" and "3:00 PM - 5:00 PM"
 * Times are assumed to be in Gulf Standard Time (Qatar, UTC+3)
 */
function parseDateAndTime(dateStr, timeStr) {
  // Extract start time from range (e.g., "3:00 PM" from "3:00 PM - 5:00 PM")
  const startTimeMatch = timeStr.match(/^(.*?)(?:\s*-|\s*to)/i);
  const startTime = startTimeMatch ? startTimeMatch[1].trim() : timeStr.trim();

  const dateTimeStr = `${dateStr} ${startTime} GMT+0300`;
  return new Date(dateTimeStr);
}

/**
 * Parse end time from time range
 */
function parseEndTime(dateStr, timeStr) {
  // Extract end time from range
  const endTimeMatch = timeStr.match(/(?:-|to)\s*(.+)$/i);
  if (endTimeMatch) {
    const endTime = endTimeMatch[1].trim();
    const dateTimeStr = `${dateStr} ${endTime} GMT+0300`;
    return new Date(dateTimeStr);
  }

  // If no end time, assume 1 hour duration
  const startDateTime = parseDateAndTime(dateStr, timeStr);
  return new Date(startDateTime.getTime() + 60 * 60 * 1000);
}

/**
 * Normalize category to match mobile app categories
 * Valid: Academic, Student Life, Sports, Other
 */
function normalizeCategory(category) {
  if (!category) return 'Other';

  const normalized = category.trim().toLowerCase();

  if (normalized.includes('academic') || normalized.includes('lecture') || normalized.includes('class')) {
    return 'Academic';
  } else if (normalized.includes('student') || normalized.includes('club') || normalized.includes('social')) {
    return 'Student Life';
  } else if (normalized.includes('sport') || normalized.includes('athletic') || normalized.includes('game')) {
    return 'Sports';
  }

  return 'Other';
}

/**
 * Health check endpoint for Zapier webhook
 */
exports.healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
};
