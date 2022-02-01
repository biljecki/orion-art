export interface GifData {
  frames: Frame[];
  meta: GifMetadata;
}

export interface Frame {
  pixels: Pixel[]
}

export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export interface GifMetadata {
  width: number;
  height: number;
  frames: number;
}
