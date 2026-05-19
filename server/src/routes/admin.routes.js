const express = require('express');
const router = express.Router();
const {
  getDashboard, getAllApplications, getApplicationDetail, updateStatus,
  sendRecommendation, deleteApplication, exportCSV, getAllUsers,
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/applications', getAllApplications);
router.get('/applications/export', exportCSV);
router.get('/applications/:id', getApplicationDetail);
router.patch('/applications/:id/status', updateStatus);
router.patch('/applications/:id/recommendation', sendRecommendation);
router.delete('/applications/:id', deleteApplication);
router.get('/users', getAllUsers);

module.exports = router;
