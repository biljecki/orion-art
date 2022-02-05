import { generatePixels } from "./collections/slugcell/slugcell";
import { makeGif } from "./utils/gifer/gifer";
import { getConfig } from "./config/slugcell.config";

const config = getConfig();

const data = generatePixels(config);

const pixelSets = data.frames.map(frame => {
  return frame.pixels.map(pixel => pixel.color)
});

const merged = new Set(pixelSets.flat());


console.log("GENERATED PIXELS - NUMBER OF UNIQUE COLORS:", [...merged].length);
// console.log(data.frames[200])

makeGif(data);
