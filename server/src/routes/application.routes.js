const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createApplication, verifyPayment, getMyApplications,
  getApplication, uploadFiles, getDashboardStats,
} = require('../controllers/application.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../services/cloudinary.service');
const { applicationValidator } = require('../middleware/validator.middleware');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/', getMyApplications);
router.post('/', applicationValidator, createApplication);
router.post('/verify-payment', verifyPayment);
router.get('/:id', getApplication);

// Upload with proper error handling for large files
router.post('/:id/upload-files', (req, res, next) => {
  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            message: 'File too large. Maximum allowed size is 25MB. You can email your answer sheet to info@veritasco.tech instead.',
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      }
      // Cloudinary or other errors
      console.error('Upload middleware error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'File upload failed. Please email your answer sheet to info@veritasco.tech',
      });
    }
    next();
  });
}, uploadFiles);

module.exports = router;
