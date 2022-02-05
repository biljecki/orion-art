
import { makeNoise2D, makeNoise4D, makeNoise3D } from "open-simplex-noise";
import { Frame, GifData } from "../../utils/gifer/gifer.types";


const noise3DRed = makeNoise4D(Date.now() + 1);
const noise3DGreen = makeNoise4D(Date.now() + 5);
const noise3DBlue = makeNoise4D(Date.now() + 10);

const noise2DOffset = makeNoise2D(Date.now());

const TWO_PI = 2 * Math.PI;

const nojser = (noise, i, j, woff, zoff, densityQuotint, speedQuotient) => {
  let val =
    noise(
      i / densityQuotint,
      j / densityQuotint,
      woff / speedQuotient,
      zoff / speedQuotient
    );

  if (val < 0) return 0;

  if (val < 0.5) return 100 + 50 + Math.floor(val * 10) // 0, 1, 2
  return 200 + Math.floor(val * 10)
};

export const generatePixels = (config) => {

  console.log(config);

  const { zoomQ, offsetSpeed, zoomSpeed, speedQuotient, densityQuotient } = config.slugCell;


  const frames = 100;

  let width = 640;
  let height = 480;

  width = 100;
  height = 100;

  const data: GifData = {
    frames: [],
    meta: {
      width,
      height,
      frames,
    }
  }

  for (
    let outerAngle = 0, z = 0;
    outerAngle < TWO_PI;
    outerAngle += TWO_PI / frames, z++
  ) {
    let woff = Math.cos(outerAngle) + 1;
    let zoff = Math.sin(outerAngle) + 1;

    let redXOffset = noise2DOffset(woff + 123, zoff + 321) * offsetSpeed;
    let redYOffset = noise2DOffset(woff + 234, zoff + 543) * offsetSpeed;

    let greenXOffset = noise2DOffset(woff + 2552, zoff + 26316) * offsetSpeed;
    let greenYOffset = noise2DOffset(woff + 4053, zoff + 10403) * offsetSpeed;

    let blueXOffset = noise2DOffset(woff + 1423, zoff + 30303) * offsetSpeed;
    let blueYOffset = noise2DOffset(woff + 412453, zoff + 249) * offsetSpeed;

    let zoomRed =
      (noise2DOffset(woff / zoomSpeed + 100, zoff / zoomSpeed + 200) + 1) * zoomQ; // * 3 //- 3 .. 3

    let zoomGreen =
      (noise2DOffset(woff / zoomSpeed, zoff / zoomSpeed) + 1) * zoomQ;

    let zoomBlue =
      (noise2DOffset(woff / zoomSpeed, zoff / zoomSpeed) + 1) * zoomQ;

    let startZoomRedX = (height * zoomRed) / -2;
    let startZoomRedY = (width * zoomRed) / -2;

    let startZoomGreenX = (height * zoomGreen) / -2;
    let startZoomGreenY = (width * zoomGreen) / -2;

    let startZoomBlueX = (height * zoomBlue) / -2;
    let startZoomBlueY = (width * zoomBlue) / -2;

    const frame: Frame = {
      pixels: []
    }

    for (let y = 0; y < width; y++) {

      for (let x = 0; x < height; x++) {
        const speedQuotient = 1;
        const densityQuotint = 90;

        const red = nojser(
          noise3DRed,
          startZoomRedX + x * zoomRed + redXOffset,
          startZoomRedY + y * zoomRed + redYOffset,
          woff,
          zoff,
          densityQuotint,
          speedQuotient
        );

        const green = nojser(
          noise3DGreen,
          startZoomGreenX + x * zoomGreen + greenXOffset,
          startZoomGreenY + y * zoomGreen + greenYOffset,
          woff,
          zoff,
          densityQuotint,
          speedQuotient
        );

        const blue = nojser(
          noise3DBlue,
          startZoomBlueX + x * zoomBlue + blueXOffset,
          startZoomBlueY + y * zoomBlue + blueYOffset,
          woff,
          zoff,
          densityQuotient,
          speedQuotient
        );



        const redC = [red, 0, 0];
        const greenC = [0, green, 0];
        const blueC = [0, 0, blue * 1.5];

        const colorZoom = [
          {
            on: !!red,
            zoom: zoomRed,
            color: redC,
          },
          {
            on: !!green,
            zoom: zoomGreen,
            color: greenC,
          },
          {
            on: !!blue,
            zoom: zoomBlue,
            color: blueC,
          }
        ].sort((a, b) => a.zoom - b.zoom).filter(cz => cz.on).map(a => a.color);
        frame.pixels.push({
          x, y, color: hexer(mergeColors(colorZoom)),
        })
      }

    }
    data.frames.push(frame);
  }


  return data;
};
const mergeColors = (arr) => {

  const len = arr.length;
  let weight = 0

  const a = arr.reduce((acc: number[], cur: number[], index: number) => {


    weight += len - index + 1;

    acc[0] += cur[0] * (len - index + 1);
    acc[1] += cur[1] * (len - index + 1);
    acc[2] += cur[2] * (len - index + 1);

    return acc;
  }, [0, 0, 0]);

  return [
    Math.round(a[0] / weight || 0),
    Math.round(a[1] / weight || 0),
    Math.round(a[2] / weight || 0),
  ]
}

const hexer = (colors) => {
  return `#${colors.map((c: number) => c.toString(16).padStart(2, '0')).join('')}`;
}
