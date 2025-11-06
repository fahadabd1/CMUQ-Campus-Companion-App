const { uploadBase64Image } = require('../config/cloudinary');

/**
 * Upload base64 image to Cloudinary
 */
exports.uploadImage = async (req, res) => {
  try {
    const { image, folder } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'No image data provided',
      });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadBase64Image(image, folder || 'lost-found');

    console.log('✓ Image uploaded to Cloudinary');

    res.json({
      success: true,
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
    });
  }
};
