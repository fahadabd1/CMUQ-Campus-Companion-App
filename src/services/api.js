/**
 * API Service for CMUQ Campus Companion App
 * Handles all backend API calls
 */

// TODO: Replace with your deployed backend URL
// For local testing: Use your computer's IP address (not localhost)
// Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:3000/api'  // Replace with your actual IP
  : 'https://your-production-api.com/api';

/**
 * Generic fetch wrapper with error handling
 */
const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Events API
 */
export const eventsAPI = {
  /**
   * Get today's events
   */
  getToday: async () => {
    try {
      const response = await apiFetch('/events/today');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
      return [];
    }
  },

  /**
   * Get upcoming events
   * @param {number} limit - Maximum number of events to fetch
   */
  getUpcoming: async (limit = 50) => {
    try {
      const response = await apiFetch(`/events/upcoming?limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  },

  /**
   * Get events by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  getByDateRange: async (startDate, endDate) => {
    try {
      const response = await apiFetch(
        `/events/range?start_date=${startDate}&end_date=${endDate}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      return [];
    }
  },

  /**
   * Get events by category
   * @param {string} category - Category (Academic, Student Life, Sports, Other)
   */
  getByCategory: async (category) => {
    try {
      const response = await apiFetch(`/events/category/${category}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching events by category:', error);
      return [];
    }
  },

  /**
   * Get event by ID
   * @param {number} id - Event ID
   */
  getById: async (id) => {
    try {
      const response = await apiFetch(`/events/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  },
};

/**
 * Sync events from API to local SQLite database
 * This allows offline access and faster loading
 */
export const syncEventsToLocal = async (db) => {
  try {
    console.log('Syncing events from server...');

    // Fetch upcoming events from API
    const events = await eventsAPI.getUpcoming(100);

    if (events.length === 0) {
      console.log('No events to sync');
      return;
    }

    // Clear existing events (optional - or implement smart merge)
    db.runSync('DELETE FROM events WHERE source = ?', ['api']);

    // Insert events into local database
    const insertStmt = db.prepareSync(
      `INSERT INTO events (title, description, category, location, start_time, end_time, source)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );

    events.forEach((event) => {
      insertStmt.executeSync([
        event.title,
        event.description || '',
        event.category || 'Other',
        event.location || '',
        event.start_time,
        event.end_time,
        'api'
      ]);
    });

    insertStmt.finalizeSync();

    console.log(`✓ Synced ${events.length} events to local database`);
  } catch (error) {
    console.error('Error syncing events:', error);
  }
};

export default eventsAPI;
