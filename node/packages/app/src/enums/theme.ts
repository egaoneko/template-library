export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type THEME = typeof THEME[keyof typeof THEME];
