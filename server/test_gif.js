const GIFEncoder = require('gif-encoder-2');
const PImage = require('pureimage');
const path = require('path');
const fs = require('fs');

async function test() {
  const fontPath = path.join(__dirname, 'fonts/Roboto-Regular.ttf');
  const fnt = PImage.registerFont(fontPath, 'Roboto-Regular');
  fnt.loadSync();

  const width = 350;
  const height = 80;

  const encoder = new GIFEncoder(width, height);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000);
  encoder.setQuality(10);

  const canvas = PImage.make(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#121214';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#ffffff';
  ctx.font = '32pt "Roboto-Regular"';
  ctx.fillText("Test", 50, 50);

  const out = fs.createWriteStream(path.join(__dirname, 'output.gif'));
  encoder.createReadStream().pipe(out);

  encoder.addFrame(ctx);
  encoder.finish();

  out.on('finish', () => {
    console.log("GIF generated successfully and saved to output.gif");
  });
}

test().catch(console.error);
