/**
 * API Service for CMUQ Campus Companion App
 * Handles all backend API calls
 */

// Backend API URLs
// Using Railway production URL for both dev and production
const API_BASE_URL = 'https://cmuq-campus-companion-app-production.up.railway.app/api';

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

/**
 * Lost & Found API
 */
export const lostFoundAPI = {
  /**
   * Get all lost/found items
   * @param {Object} filters - Optional filters (type, category, limit)
   */
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.limit) params.append('limit', filters.limit);

      const queryString = params.toString();
      const endpoint = `/lost-found${queryString ? `?${queryString}` : ''}`;

      const response = await apiFetch(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching lost/found items:', error);
      return [];
    }
  },

  /**
   * Get single item by ID
   * @param {number} id - Item ID
   */
  getById: async (id) => {
    try {
      const response = await apiFetch(`/lost-found/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching lost/found item:', error);
      return null;
    }
  },

  /**
   * Create new lost/found item
   * @param {Object} itemData - Item data
   */
  create: async (itemData) => {
    try {
      const response = await apiFetch('/lost-found', {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
      return response.data || null;
    } catch (error) {
      console.error('Error creating lost/found item:', error);
      throw error;
    }
  },

  /**
   * Update item
   * @param {number} id - Item ID
   * @param {Object} updateData - Data to update
   */
  update: async (id, updateData) => {
    try {
      const response = await apiFetch(`/lost-found/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      return response.data || null;
    } catch (error) {
      console.error('Error updating lost/found item:', error);
      throw error;
    }
  },

  /**
   * Mark item as resolved
   * @param {number} id - Item ID
   */
  markAsResolved: async (id) => {
    try {
      const response = await apiFetch(`/lost-found/${id}/resolve`, {
        method: 'PATCH',
      });
      return response.data || null;
    } catch (error) {
      console.error('Error marking item as resolved:', error);
      throw error;
    }
  },

  /**
   * Delete item
   * @param {number} id - Item ID
   */
  delete: async (id) => {
    try {
      await apiFetch(`/lost-found/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting lost/found item:', error);
      throw error;
    }
  },
};

/**
 * Sync lost/found items from API to local SQLite database
 */
export const syncLostFoundToLocal = async (db) => {
  try {
    console.log('Syncing lost/found items from server...');

    // Fetch all active items from API
    const items = await lostFoundAPI.getAll({ limit: 200 });

    if (items.length === 0) {
      console.log('No lost/found items to sync');
      return;
    }

    // Clear existing items from API source
    db.runSync('DELETE FROM lost_found WHERE 1=1'); // Clear all for full sync

    // Insert items into local database
    const insertStmt = db.prepareSync(
      `INSERT INTO lost_found (type, item_name, description, category, location_lost, image_path, contact_info, status, created_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    items.forEach((item) => {
      insertStmt.executeSync([
        item.type,
        item.item_name,
        item.description || '',
        item.category || 'Other',
        item.location_lost || '',
        item.image_url || null,
        item.contact_info || '',
        item.status || 'active',
        item.created_at,
        item.expires_at
      ]);
    });

    insertStmt.finalizeSync();

    console.log(`✓ Synced ${items.length} lost/found items to local database`);
  } catch (error) {
    console.error('Error syncing lost/found items:', error);
  }
};

export default eventsAPI;
