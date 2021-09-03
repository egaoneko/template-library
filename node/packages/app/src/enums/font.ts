export const FONT_SET = {
  NOTO_SANS: 'NotoSans',
} as const;
export type FONT_SET = typeof FONT_SET[keyof typeof FONT_SET];
