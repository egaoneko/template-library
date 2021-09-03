import {FONT_SET} from '../enums/font';
import {COLOR_SET} from '../enums/color';
import {THEME} from '../enums/theme';

export interface Theme {
  font: string;
  primary: string;
  secondary: string;
  text: string;
  description: string;
  background: string;
  foreground: string;
  border: string;
}

const common = {
  font: FONT_SET.NOTO_SANS,
  primary: COLOR_SET.PRIMARY,
  secondary: COLOR_SET.SECONDARY,
};

export const light: Theme = {
  text: COLOR_SET.LIGHT_MODE_TEXT,
  description: COLOR_SET.LIGHT_MODE_DESCRIPTION,
  background: COLOR_SET.LIGHT_MODE_BACKGROUND,
  foreground: COLOR_SET.LIGHT_MODE_FOREGROUND,
  border: COLOR_SET.LIGHT_MODE_BORDER,
  ...common,
};

export const dark: Theme = {
  text: COLOR_SET.DARK_MODE_TEXT,
  description: COLOR_SET.DARK_MODE_DESCRIPTION,
  background: COLOR_SET.DARK_MODE_BACKGROUND,
  foreground: COLOR_SET.DARK_MODE_FOREGROUND,
  border: COLOR_SET.DARK_MODE_BORDER,
  ...common,
};

export const theme = {
  [THEME.LIGHT]: light,
  [THEME.DARK]: dark,
};
