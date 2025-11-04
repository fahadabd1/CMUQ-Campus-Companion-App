const pool = require('../config/database');

class Event {
  /**
   * Create a new event
   */
  static async create(eventData) {
    const {
      title,
      description,
      category,
      location,
      start_time,
      end_time,
      source = 'email',
      raw_email_data = null
    } = eventData;

    const query = `
      INSERT INTO events (title, description, category, location, start_time, end_time, source, raw_email_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [title, description, category, location, start_time, end_time, source, raw_email_data];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Get all upcoming events (from today onwards)
   */
  static async getUpcoming(limit = 50) {
    const query = `
      SELECT * FROM events
      WHERE start_time >= NOW()
      ORDER BY start_time ASC
      LIMIT $1;
    `;

    try {
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }

  /**
   * Get today's events
   */
  static async getToday() {
    const query = `
      SELECT * FROM events
      WHERE DATE(start_time) = CURRENT_DATE
      ORDER BY start_time ASC;
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
      throw error;
    }
  }

  /**
   * Get events by date range
   */
  static async getByDateRange(startDate, endDate) {
    const query = `
      SELECT * FROM events
      WHERE start_time >= $1 AND start_time <= $2
      ORDER BY start_time ASC;
    `;

    try {
      const result = await pool.query(query, [startDate, endDate]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      throw error;
    }
  }

  /**
   * Get event by ID
   */
  static async getById(id) {
    const query = `SELECT * FROM events WHERE id = $1;`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw error;
    }
  }

  /**
   * Delete event by ID
   */
  static async delete(id) {
    const query = `DELETE FROM events WHERE id = $1 RETURNING *;`;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Get events by category
   */
  static async getByCategory(category) {
    const query = `
      SELECT * FROM events
      WHERE category = $1 AND start_time >= NOW()
      ORDER BY start_time ASC;
    `;

    try {
      const result = await pool.query(query, [category]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching events by category:', error);
      throw error;
    }
  }
}

module.exports = Event;
