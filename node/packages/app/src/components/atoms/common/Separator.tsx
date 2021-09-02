import React, {FC} from 'react';
import {Colors} from 'react-native-paper';
import styled from 'styled-components/native';
import useDarkMode from '../../../hooks/useDarkMode';

interface PropsType {}

const Separator: FC<PropsType> = () => {
  return <StyledView darkMode={useDarkMode()} />;
};

export default Separator;

const StyledView = styled.View<{darkMode: boolean}>`
  border-bottom-width: 1px;
  border-color: ${({darkMode}) => (darkMode ? Colors.grey700 : Colors.grey400)};
`;
