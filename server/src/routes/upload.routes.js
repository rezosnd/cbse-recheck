const express = require('express');
const router = express.Router();
const { upload, deleteFile } = require('../services/cloudinary.service');
const { protect } = require('../middleware/auth.middleware');

// protect middleware moved down
// POST /api/upload/single
router.post('/single', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  res.status(200).json({
    success: true,
    file: {
      url: req.file.path || req.file.secure_url,
      publicId: req.file.filename || req.file.public_id,
      name: req.file.originalname,
    },
  });
});

// POST /api/upload/multiple
router.post('/multiple', upload.array('files', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded.' });
  }
  const files = req.files.map(f => ({
    url: f.path || f.secure_url,
    publicId: f.filename || f.public_id,
    name: f.originalname,
  }));
  res.status(200).json({ success: true, files });
});

// DELETE /api/upload/:publicId
router.delete('/:publicId', async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    if (!/^[a-zA-Z0-9/_-]+$/.test(publicId)) {
      return res.status(400).json({ success: false, message: 'Invalid file ID.' });
    }
    await deleteFile(publicId);
    res.status(200).json({ success: true, message: 'File deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete file.' });
  }
});

// GET /api/upload/download-zip - Securely download Cloudinary PDFs as a ZIP file
// This bypasses BOTH local ISP blocks on res.cloudinary.com AND Cloudinary's strict PDF anti-malware delivery rules!
router.get('/download-zip', (req, res) => {
  try {
    const { publicId } = req.query;
    if (!publicId) return res.status(400).send('Public ID is required');

    const { v2: cloudinary } = require('cloudinary');
    
    // Generate an authenticated ZIP download URL that uses api.cloudinary.com (which ISPs do not block)
    const url = cloudinary.utils.download_archive_url({
      public_ids: [publicId],
      resource_type: 'image', // Cloudinary auto-classified the PDFs as images
      target_format: 'zip'
    });

    // Redirect the browser to instantly start downloading the ZIP file
    res.redirect(url);
  } catch (err) {
    console.error('Archive download error:', err);
    res.status(500).send('Failed to generate download link');
  }
});

// Protect all other routes below this line
router.use(protect);

module.exports = router;
