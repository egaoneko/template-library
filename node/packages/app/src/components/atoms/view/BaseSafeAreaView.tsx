import React, { FC } from 'react';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { StyledProps } from 'styled-components';

interface PropsType extends StyledProps<ViewStyle> {}

const BaseSafeAreaView: FC<PropsType> = ({ children, ...props }) => {
  return <StyledSafeAreaView {...props}>{children}</StyledSafeAreaView>;
};

export default BaseSafeAreaView;

const StyledSafeAreaView = styled.SafeAreaView`
  background-color: ${({ theme }) => theme.background};
`;
