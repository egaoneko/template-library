import React, {FC} from 'react';
import {ViewStyle} from 'react-native';
import {StyledProps} from 'styled-components';
import styled from 'styled-components/native';
import useDarkMode from '../../../hooks/useDarkMode';
import {COLOR_SET} from '../../../enums/color';

interface PropsType extends StyledProps<ViewStyle> {}

const DarkModeView: FC<PropsType> = ({children, ...props}) => {
  return (
    <StyledView darkMode={useDarkMode()} {...props}>
      {children}
    </StyledView>
  );
};

export default DarkModeView;

const StyledView = styled.View<{darkMode: boolean}>`
  background-color: ${({darkMode}) =>
    darkMode
      ? COLOR_SET.DARK_MODE_BACKGROUND
      : COLOR_SET.LIGHT_MODE_BACKGROUND};
`;
