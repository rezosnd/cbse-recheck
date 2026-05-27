const express = require('express');
const fs = require('fs');
const path = require('path');
const GIFEncoder = require('gif-encoder-2');
const PImage = require('pureimage');

const router = express.Router();

let fontLoaded = false;
const fontPath = path.join(__dirname, '../../fonts/Roboto-Regular.ttf');

function ensureFontLoaded() {
  if (!fontLoaded && fs.existsSync(fontPath)) {
    const fnt = PImage.registerFont(fontPath, 'Roboto-Regular');
    fnt.loadSync();
    fontLoaded = true;
  }
}

function drawFrame(ctx, width, height, text) {
  // Fill background
  ctx.fillStyle = '#121214'; 
  ctx.fillRect(0, 0, width, height);

  // Add a subtle border or something if needed
  ctx.fillStyle = '#ffffff';
  ctx.font = '32pt "Roboto-Regular"';
  // pureimage text alignment is basic, let's calculate rough center
  // 32pt is approx 42px height, 16px per char width
  const approximateTextWidth = text.length * 18; 
  const x = (width - approximateTextWidth) / 2;
  const y = (height + 32) / 2 - 8;

  ctx.fillText(text, x, y);
}

router.get('/gif', (req, res) => {
  try {
    ensureFontLoaded();
  } catch (err) {
    console.error('Failed to load font for timer', err);
  }

  const { target } = req.query; // Expected: timestamp or ISO string
  if (!target) {
    return res.status(400).send('Target time is required');
  }

  const targetTime = new Date(target).getTime();
  if (isNaN(targetTime)) {
    return res.status(400).send('Invalid target time');
  }

  const width = 350;
  const height = 80;

  const encoder = new GIFEncoder(width, height);
  encoder.start();
  encoder.setRepeat(0);   // Loop indefinitely
  encoder.setDelay(1000); // 1 second per frame
  encoder.setQuality(10); // image quality

  const canvas = PImage.make(width, height);
  const ctx = canvas.getContext('2d');

  // Tell the browser this is a GIF and not to cache it, so every open of the email shows the latest time
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  
  // Pipe the encoder stream directly to response
  encoder.createReadStream().pipe(res);

  // Generate 60 frames (1 minute of counting down)
  const frames = 60;
  const now = Date.now();

  for (let i = 0; i < frames; i++) {
    const currentTime = now + (i * 1000);
    let diff = targetTime - currentTime;
    
    if (diff < 0) diff = 0;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const text = `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
    
    drawFrame(ctx, width, height, text);
    encoder.addFrame(ctx);
    
    if (diff <= 0) break; // stop adding frames if timer reached 0
  }

  encoder.finish();
});

module.exports = router;
