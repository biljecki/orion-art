
import { makeNoise2D, makeNoise4D, makeNoise3D } from "open-simplex-noise";
import { Frame, GifData } from "../../utils/gifer/gifer.types";


const noise3DRed = makeNoise4D(Date.now() + 1);
const noise3DGreen = makeNoise4D(Date.now() + 5);
const noise3DBlue = makeNoise4D(Date.now() + 10);

const noise2DOffset = makeNoise2D(Date.now());

const backgroundNoise = makeNoise2D(Date.now());
const noise4D = makeNoise4D(Date.now());

const colors = Object.values({
  white: { r: 255, g: 255, b: 255, a: 255 },
  blue: { r: 0, g: 0, b: 255, a: 255 },
  cyan: { r: 0, g: 255, b: 255, a: 255 },
  whatever: { r: 255, g: 0, b: 255, a: 255 },
  yellow: { r: 255, g: 255, b: 0, a: 255 },
  red: { r: 255, g: 0, b: 0, a: 255 },
  green: { r: 0, g: 255, b: 0, a: 255 },
  black: { r: 0, g: 0, b: 0, a: 255 },
}).map((a) => a);

const numberOfColors = colors.length;

const TWO_PI = 2 * Math.PI;

const nojser = (noise, i, j, woff, zoff, densityQuotint, speedQuotient) => {
 
  let val =
    noise(
      i / densityQuotint,
      j / densityQuotint,
      woff / speedQuotient,
      zoff / speedQuotient
    ); //0-2



  if (val < 0.3) return 0;
  // return 250;

      // console.log(val)

  if (val < 0.5) return 50 + Math.floor(val * 50) // 0, 1, 2
  return 150 + Math.floor(val * 50)

  // const color = q  // 150, 200, 250

  // return color;
};

export const generatePixels = () => {

  // const width = 1280;
  // const height = 720;
  // const frames = 100;

  const frames = 100;

  let width = 640;
  let height = 480;

  width = 200;
  height = 200;
  


  const data: GifData = {
    frames: [],
    meta: {
      width,
      height,
      frames,
    }
  }

  const zoomQ = 2;
  const zoomSpeed = 1;


  for (
    let outerAngle = 0, z = 0;
    outerAngle < TWO_PI;
    outerAngle += TWO_PI / frames, z++
  ) {
    let woff = Math.cos(outerAngle) + 1 ;
    let zoff = Math.sin(outerAngle) + 1 ;


    const offsetSpeed = 100;

    let redXOffset = noise2DOffset(woff + 1000, zoff + 1000) * offsetSpeed;
    let redYOffset = noise2DOffset(woff + 1000, zoff + 1000) * offsetSpeed;

    let greenXOffset = noise2DOffset(woff, zoff + 1000) * offsetSpeed;
    let greenYOffset = noise2DOffset(woff + 1000, zoff) * offsetSpeed;

    let blueXOffset = noise2DOffset(woff + 1000, zoff) * offsetSpeed;
    let blueYOffset = noise2DOffset(woff, zoff + 1000) * offsetSpeed;

    let zoomRed =
      (noise2DOffset(woff / 5 + 100, zoff / 5 - 100) + 1) * zoomQ; // * 3 //- 3 .. 3

    let zoomGreen =
      (noise2DOffset(woff / 5 + 200, zoff / 5) + 1) * zoomQ;

    let zoomBlue =
      (noise2DOffset(woff / 5 - 200, zoff / 5) + 1) * zoomQ;

    let startZoomRedX = (500 * zoomRed) / zoomSpeed;
    let startZoomRedY = (500 * zoomRed) / zoomSpeed;

    let startZoomGreenX = (500 * zoomGreen) / zoomSpeed;
    let startZoomGreenY = (500 * zoomGreen) / zoomSpeed;

    let startZoomBlueX = (500 * zoomBlue) / zoomSpeed;
    let startZoomBlueY = (500 * zoomBlue) / zoomSpeed;

    const frame: Frame = {
      pixels: []
    }

    for (let y = 0; y < width; y++) {

      for (let x = 0; x < height; x++) {
        const speedQuotient = 1;
        const densityQuotint = 30;

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
          densityQuotint,
          speedQuotient
        );



        const redC = [red, 0, 0];
        const greenC = [0, green, 0];
        const blueC = [0, 0, blue];

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

        // if (colorZoom[0] && !colorZoom[1]) {

          // console.log(color)
          frame.pixels.push({
            x, y, color: hexer(mergeColors(colorZoom)),
          })
    
      }

    }
    data.frames.push(frame);
  }


  return data;
};


const mergeColor = (a, b) => {
  return [
    a[0] + b[0] / 2,
    a[1] + b[1] / 2,
    a[2] + b[2] / 2,
  ]
}


const mergeColors = (arr) => {



  const len = arr.length;
  let weight = 0
  // console.log("---------")

  const a = arr.reduce((acc: number[], cur: number[], index: number) => {


    weight += len - index + 1;

    acc[0] += cur[0] * (len - index + 1);
    acc[1] += cur[1] * (len - index+ 1);
    acc[2] += cur[2] * (len - index+ 1);

    return acc;
  }, [0,0,0]);


  // console.log([
  //   a[0]/weight || 0,
  //   a[1]/weight || 0,
  //   a[2]/weight || 0,
  // ])


  return [
    Math.round(a[0]/weight || 0),
    Math.round(a[1]/weight || 0),
    Math.round(a[2]/weight || 0),
  ]
}

const hexer = (colors) => {
  // console.log(colors, colors.map(c => c.toString(16)) )

  return `#${colors.map((c: number) => c.toString(16).padStart(2, '0')).join('')}`;
}
