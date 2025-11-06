const LostFound = require('../models/LostFound');

/**
 * Get all lost/found items
 */
exports.getAll = async (req, res) => {
  try {
    const { type, category, limit } = req.query;

    const filters = {};
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (limit) filters.limit = parseInt(limit);

    const items = await LostFound.getAll(filters);

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching lost/found items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch items'
    });
  }
};

/**
 * Get single item by ID
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await LostFound.getById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch item'
    });
  }
};

/**
 * Create new lost/found item
 */
exports.create = async (req, res) => {
  try {
    const {
      type,
      item_name,
      description,
      category,
      location_lost,
      image_url,
      contact_info,
      expires_at
    } = req.body;

    // Validation
    if (!type || !item_name) {
      return res.status(400).json({
        success: false,
        error: 'Type and item name are required'
      });
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be either "lost" or "found"'
      });
    }

    // Calculate expiration date (30 days from now if not provided)
    let expirationDate = expires_at;
    if (!expirationDate) {
      const now = new Date();
      now.setDate(now.getDate() + 30); // 30 days
      expirationDate = now.toISOString();
    }

    const itemData = {
      type,
      item_name,
      description: description || '',
      category: category || 'Other',
      location_lost: location_lost || '',
      image_url: image_url || null,
      contact_info: contact_info || '',
      status: 'active',
      expires_at: expirationDate
    };

    const newItem = await LostFound.create(itemData);

    console.log(`✓ Created ${type} item: ${item_name} (ID: ${newItem.id})`);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: newItem
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create item'
    });
  }
};

/**
 * Update item
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if item exists
    const existingItem = await LostFound.getById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    const updatedItem = await LostFound.update(id, updateData);

    console.log(`✓ Updated item: ${id}`);

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update item'
    });
  }
};

/**
 * Mark item as resolved
 */
exports.markAsResolved = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await LostFound.markAsResolved(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    console.log(`✓ Marked item as resolved: ${id}`);

    res.json({
      success: true,
      message: 'Item marked as resolved',
      data: item
    });
  } catch (error) {
    console.error('Error marking item as resolved:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark item as resolved'
    });
  }
};

/**
 * Delete item
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await LostFound.delete(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    console.log(`✓ Deleted item: ${id}`);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete item'
    });
  }
};

/**
 * Cleanup expired items
 */
exports.cleanupExpired = async (req, res) => {
  try {
    const expiredItems = await LostFound.cleanupExpired();

    res.json({
      success: true,
      message: `Marked ${expiredItems.length} items as expired`,
      data: expiredItems
    });
  } catch (error) {
    console.error('Error cleaning up expired items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup expired items'
    });
  }
};
