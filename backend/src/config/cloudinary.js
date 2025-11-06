const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
// Add these to your Railway environment variables:
// CLOUDINARY_CLOUD_NAME
// CLOUDINARY_API_KEY
// CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
});

/**
 * Upload base64 image to Cloudinary
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string>} - Cloud URL of uploaded image
 */
async function uploadBase64Image(base64Data, folder = 'lost-found') {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Limit max size
        { quality: 'auto' }, // Auto quality
        { fetch_format: 'auto' }, // Auto format (WebP, etc.)
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

module.exports = {
  cloudinary,
  uploadBase64Image,
  deleteImage,
};
