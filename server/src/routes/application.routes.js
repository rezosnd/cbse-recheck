const express = require('express');
const router = express.Router();
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
router.post('/:id/upload-files', upload.array('files', 5), uploadFiles);

module.exports = router;
