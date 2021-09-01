import React, {FC} from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {StyledProps} from 'styled-components';
import {COLOR_SET} from '../../../enums/color';
import useDarkMode from '../../../hooks/useDarkMode';

interface PropsType extends StyledProps<ViewStyle> {}

const DarkModeSafeAreaView: FC<PropsType> = ({children, ...props}) => {
  return (
    <StyledSafeAreaView darkMode={useDarkMode()} {...props}>
      {children}
    </StyledSafeAreaView>
  );
};

export default DarkModeSafeAreaView;

const StyledSafeAreaView = styled.SafeAreaView<{darkMode: boolean}>`
  background-color: ${({darkMode}) =>
    darkMode
      ? COLOR_SET.DARK_MODE_BACKGROUND
      : COLOR_SET.LIGHT_MODE_BACKGROUND};
`;
