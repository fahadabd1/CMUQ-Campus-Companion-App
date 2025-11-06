const pool = require('../config/database');

class LostFound {
  /**
   * Create lost_found table if it doesn't exist
   */
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS lost_found (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL CHECK (type IN ('lost', 'found')),
        item_name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        location_lost VARCHAR(255),
        image_url TEXT,
        contact_info VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'expired')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_lost_found_status ON lost_found(status);
      CREATE INDEX IF NOT EXISTS idx_lost_found_type ON lost_found(type);
      CREATE INDEX IF NOT EXISTS idx_lost_found_created_at ON lost_found(created_at DESC);
    `;

    try {
      await pool.query(query);
      console.log('✓ Lost & Found table initialized');
    } catch (error) {
      console.error('Error initializing lost_found table:', error);
      throw error;
    }
  }

  /**
   * Create a new lost/found item
   * @param {Object} itemData - Item data
   * @returns {Object} Created item
   */
  static async create(itemData) {
    const {
      type,
      item_name,
      description,
      category,
      location_lost,
      image_url,
      contact_info,
      status = 'active',
      expires_at
    } = itemData;

    const query = `
      INSERT INTO lost_found (
        type, item_name, description, category, location_lost,
        image_url, contact_info, status, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      type,
      item_name,
      description,
      category,
      location_lost,
      image_url,
      contact_info,
      status,
      expires_at
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating lost/found item:', error);
      throw error;
    }
  }

  /**
   * Get all active items
   * @param {Object} filters - Optional filters
   * @returns {Array} List of items
   */
  static async getAll(filters = {}) {
    let query = `
      SELECT * FROM lost_found
      WHERE status = 'active'
    `;

    const values = [];
    let paramCount = 1;

    // Filter by type (lost/found)
    if (filters.type) {
      query += ` AND type = $${paramCount}`;
      values.push(filters.type);
      paramCount++;
    }

    // Filter by category
    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    // Limit results
    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
    }

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error fetching lost/found items:', error);
      throw error;
    }
  }

  /**
   * Get item by ID
   * @param {number} id - Item ID
   * @returns {Object|null} Item or null
   */
  static async getById(id) {
    const query = 'SELECT * FROM lost_found WHERE id = $1';

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching lost/found item:', error);
      throw error;
    }
  }

  /**
   * Update item
   * @param {number} id - Item ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated item or null
   */
  static async update(id, updateData) {
    const allowedFields = [
      'item_name',
      'description',
      'category',
      'location_lost',
      'image_url',
      'contact_info',
      'status'
    ];

    const updates = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add ID as last parameter
    values.push(id);

    const query = `
      UPDATE lost_found
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating lost/found item:', error);
      throw error;
    }
  }

  /**
   * Delete item
   * @param {number} id - Item ID
   * @returns {boolean} Success status
   */
  static async delete(id) {
    const query = 'DELETE FROM lost_found WHERE id = $1';

    try {
      const result = await pool.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting lost/found item:', error);
      throw error;
    }
  }

  /**
   * Mark item as resolved
   * @param {number} id - Item ID
   * @returns {Object|null} Updated item or null
   */
  static async markAsResolved(id) {
    return this.update(id, { status: 'resolved' });
  }

  /**
   * Clean up expired items (can be run as a cron job)
   */
  static async cleanupExpired() {
    const query = `
      UPDATE lost_found
      SET status = 'expired'
      WHERE status = 'active'
        AND expires_at IS NOT NULL
        AND expires_at < CURRENT_TIMESTAMP
      RETURNING id
    `;

    try {
      const result = await pool.query(query);
      console.log(`✓ Marked ${result.rowCount} items as expired`);
      return result.rows;
    } catch (error) {
      console.error('Error cleaning up expired items:', error);
      throw error;
    }
  }
}

module.exports = LostFound;
