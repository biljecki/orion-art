import { generatePixels } from "./collections/slugcell/slugcell";
import { makeGif } from "./utils/gifer/gifer";

const data = generatePixels();

const pixelSets = data.frames.map(frame => {
  return frame.pixels.map(pixel => pixel.color)
});

const merged = new Set(pixelSets.flat());


console.log("GENERATED PIXELS", [...merged].length);
// console.log(data.frames[200])

makeGif(data);



