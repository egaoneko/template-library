import {Colors} from 'react-native-paper';
export const COLOR_SET = {
  PRIMARY: '#5cb85c',
  SECONDARY: '#3d8b3d',

  LIGHT_MODE_TEXT: Colors.black,
  LIGHT_MODE_BACKGROUND: Colors.white,

  DARK_MODE_TEXT: Colors.white,
  DARK_MODE_BACKGROUND: Colors.black,
} as const;

export type COLOR_SET = typeof COLOR_SET[keyof typeof COLOR_SET];
