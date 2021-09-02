import React, {FC} from 'react';
import {TextStyle} from 'react-native';
import {StyledProps} from 'styled-components';
import styled from 'styled-components/native';
import useDarkMode from '../../../hooks/useDarkMode';
import {COLOR_SET} from '../../../enums/color';
import {FONT_SET} from '../../../enums/font';

export interface TextPropsType extends StyledProps<TextStyle> {
  active?: boolean;
}

const DarkModeText: FC<TextPropsType> = ({children, ...props}) => {
  return (
    <StyledText darkMode={useDarkMode()} {...props}>
      {children}
    </StyledText>
  );
};

export default DarkModeText;
const StyledText = styled.Text<{active?: boolean; darkMode: boolean}>`
  font-family: ${FONT_SET.BASE_FONT};
  color: ${({active, darkMode}) =>
    active
      ? COLOR_SET.PRIMARY
      : darkMode
      ? COLOR_SET.DARK_MODE_TEXT
      : COLOR_SET.LIGHT_MODE_TEXT};
`;
