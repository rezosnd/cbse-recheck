const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

// Secure file filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(mime) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'), false);
  }

  // Sanitize filename
  file.originalname = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  cb(null, true);
};

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype);
    const params = {
      folder: 'cbse-recheck/documents',
      resource_type: isImage ? 'image' : 'raw',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      chunk_size: 6000000, // 6MB chunks — allows large files on any Cloudinary plan
    };
    
    if (isImage) {
      params.allowed_formats = ['jpg', 'jpeg', 'png'];
      params.transformation = [{ quality: 'auto', fetch_format: 'auto' }];
    }
    
    return params;
  },
});

// Multer upload middleware
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 5 },
  fileFilter,
});

// Delete file from Cloudinary
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
    throw err;
  }
};

module.exports = { upload, cloudinary, deleteFile };
