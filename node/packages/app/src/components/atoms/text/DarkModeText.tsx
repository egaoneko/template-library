import React, {FC} from 'react';
import {TextStyle} from 'react-native';
import {StyledProps} from 'styled-components';
import styled from 'styled-components/native';
import useDarkMode from '../../../hooks/useDarkMode';
import {COLOR_SET} from '../../../enums/color';

interface PropsType extends StyledProps<TextStyle> {}

const DarkModeText: FC<PropsType> = ({children, ...props}) => {
  return (
    <StyledText darkMode={useDarkMode()} {...props}>
      {children}
    </StyledText>
  );
};

export default DarkModeText;
const StyledText = styled.Text<{darkMode: boolean}>`
  color: ${({darkMode}) =>
    darkMode ? COLOR_SET.DARK_MODE_TEXT : COLOR_SET.LIGHT_MODE_TEXT};
`;
