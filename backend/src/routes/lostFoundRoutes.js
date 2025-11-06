const express = require('express');
const router = express.Router();
const lostFoundController = require('../controllers/lostFoundController');

/**
 * @route   GET /api/lost-found
 * @desc    Get all lost/found items (with optional filters)
 * @query   type (lost/found), category, limit
 */
router.get('/', lostFoundController.getAll);

/**
 * @route   GET /api/lost-found/:id
 * @desc    Get single item by ID
 */
router.get('/:id', lostFoundController.getById);

/**
 * @route   POST /api/lost-found
 * @desc    Create new lost/found item
 * @body    type, item_name, description, category, location_lost, image_url, contact_info
 */
router.post('/', lostFoundController.create);

/**
 * @route   PUT /api/lost-found/:id
 * @desc    Update item
 */
router.put('/:id', lostFoundController.update);

/**
 * @route   PATCH /api/lost-found/:id/resolve
 * @desc    Mark item as resolved
 */
router.patch('/:id/resolve', lostFoundController.markAsResolved);

/**
 * @route   DELETE /api/lost-found/:id
 * @desc    Delete item
 */
router.delete('/:id', lostFoundController.delete);

/**
 * @route   POST /api/lost-found/cleanup
 * @desc    Cleanup expired items (admin/cron)
 */
router.post('/cleanup', lostFoundController.cleanupExpired);

module.exports = router;
