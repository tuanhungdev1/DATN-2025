export const Gender = {
  Male: 0,
  Female: 1,
  Other: 2,
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];
