export const FONT_SET = {
  BASE_FONT: 'NotoSans-Bold',
} as const;
export type FONT_SET = typeof FONT_SET[keyof typeof FONT_SET];
