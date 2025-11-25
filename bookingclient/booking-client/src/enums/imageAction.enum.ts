export const ImageAction = {
  Keep: 0,
  Update: 1,
  Remove: 2,
};

export type ImageAction = (typeof ImageAction)[keyof typeof ImageAction];
