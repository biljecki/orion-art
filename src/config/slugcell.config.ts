export const slugcellConfig = {
  meta: {
    width: 200,
    height: 200,
    frames: 100,
  },
  ranges: {
    offsetSpeed: {
      min: 50,
      max: 170,
    },
    zoomQ: {
      min: 1,
      max: 7,
    },
    zoomSpeed: {
      min: 1,
      max: 5,
    },
    speedQuotient: {
      min: 5,
      max: 5,
    },
    densityQuotient: {
      min: 50,
      max: 150,
    },
  },
};

export const getConfig = () => {

  const { ranges, meta } = slugcellConfig;
  const slugCell = {}

  Object.entries(ranges).forEach(([k, v]) => {
    slugCell[k] = Math.random() * (v.max - v.min) + v.min;
  });


  return { 
    meta, slugCell
  }
};
