import GIFEncoder from 'gifencoder';
import { createCanvas } from 'canvas';
import fs from 'fs';
import { Frame, GifData, Pixel } from './gifer.types';

export const makeGif = ({ frames, meta }: GifData) => {
  const encoder = new GIFEncoder(meta.width, meta.height);

  encoder.createReadStream().pipe(fs.createWriteStream('myanimated.gif'));

  encoder.start();
  encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
  encoder.setDelay(10);  // frame delay in ms
  encoder.setQuality(1); // image quality. 10 is default.

  // use node-canvas
  const canvas = createCanvas(meta.width, meta.height);
  const ctx = canvas.getContext('2d');
  

  frames.forEach((frame: Frame) => {

    ctx.clearRect(0,0, meta.width, meta.height)
    

    frame.pixels.forEach(({ x, y, color }: Pixel) => {
      ctx.fillStyle = color;
      ctx.fillRect(y, x, 1, 1);
    });
    encoder.addFrame(ctx);
  });

  encoder.finish();

}

