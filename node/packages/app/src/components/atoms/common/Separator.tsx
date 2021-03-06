import React, { FC } from 'react';
import styled from 'styled-components/native';

import useDarkMode from 'src/hooks/useDarkMode';

interface PropsType {}

const Separator: FC<PropsType> = () => {
  return <StyledView darkMode={useDarkMode()} />;
};

export default Separator;

const StyledView = styled.View<{ darkMode: boolean }>`
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.border};
`;
