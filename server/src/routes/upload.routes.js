const express = require('express');
const router = express.Router();
const { upload, deleteFile } = require('../services/cloudinary.service');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

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
router.get('/download', async (req, res) => {
  try {
    const { url, filename } = req.query;
    if (!url) return res.status(400).send('URL is required');

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch from Cloudinary');

    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'download.pdf'}"`);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');

    // Pipe the response stream directly to the client
    const { Readable } = require('stream');
    const readable = Readable.fromWeb(response.body);
    readable.pipe(res);
  } catch (err) {
    console.error('Proxy download error:', err);
    res.status(500).send('Failed to download file');
  }
});

module.exports = router;
