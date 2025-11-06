const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

/**
 * @route   POST /api/upload/image
 * @desc    Upload base64 image to Cloudinary
 * @body    { image: "base64string", folder: "optional-folder-name" }
 */
router.post('/image', uploadController.uploadImage);

module.exports = router;
