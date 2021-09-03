import {Colors} from 'react-native-paper';
export const COLOR_SET = {
  PRIMARY: '#5cb85c',
  SECONDARY: '#3d8b3d',

  LIGHT_MODE_TEXT: Colors.black,
  LIGHT_MODE_DESCRIPTION: Colors.grey600,
  LIGHT_MODE_BACKGROUND: Colors.white,
  LIGHT_MODE_FOREGROUND: Colors.grey100,
  LIGHT_MODE_BORDER: Colors.grey300,

  DARK_MODE_TEXT: Colors.white,
  DARK_MODE_DESCRIPTION: Colors.grey300,
  DARK_MODE_BACKGROUND: Colors.black,
  DARK_MODE_FOREGROUND: Colors.grey800,
  DARK_MODE_BORDER: Colors.grey700,
} as const;

export type COLOR_SET = typeof COLOR_SET[keyof typeof COLOR_SET];
