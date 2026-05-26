const cloudinary = require('cloudinary').v2;
require('dotenv').config({path: './.env'});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const url = cloudinary.url('cbse-recheck/documents/file_pe2yas', {
  resource_type: 'image',
  type: 'upload',
  sign_url: true,
  format: 'pdf',
  flags: 'attachment'
});

console.log('SIGNED URL:', url);
