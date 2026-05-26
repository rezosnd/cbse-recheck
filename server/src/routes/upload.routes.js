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

// GET /api/upload/download - Proxy file download to avoid CORS and fl_attachment errors
// We place this BEFORE protect so it can be accessed directly via URL without auth token headers,
// which prevents false 'session expired' errors when downloading.
router.get('/download', (req, res) => {
  try {
    const { url, filename } = req.query;
    if (!url) return res.status(400).send('URL is required');
    
    // SSRF Protection: Only allow proxying Cloudinary URLs!
    if (!url.startsWith('https://res.cloudinary.com/')) {
      return res.status(403).send('Forbidden URL');
    }

    const https = require('https');
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).send('Failed to fetch from Cloudinary');
      }

      res.setHeader('Content-Disposition', `attachment; filename="${filename || 'download.pdf'}"`);
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/pdf');

      // Pipe the response stream directly to the client
      response.pipe(res);
    }).on('error', (err) => {
      console.error('Proxy download https error:', err);
      res.status(500).send('Failed to download file');
    });
  } catch (err) {
    console.error('Proxy download error:', err);
    res.status(500).send('Failed to download file');
  }
});

// Protect all other routes below this line
router.use(protect);

module.exports = router;
