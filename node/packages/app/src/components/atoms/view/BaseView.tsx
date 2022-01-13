import React, { FC } from 'react';
import { ViewStyle } from 'react-native';
import { StyledProps } from 'styled-components';
import styled from 'styled-components/native';

interface PropsType extends StyledProps<ViewStyle> {}

const BaseView: FC<PropsType> = ({ children, ...props }) => {
  return <StyledView {...props}>{children}</StyledView>;
};

export default BaseView;

const StyledView = styled.View`
  background-color: ${({ theme }) => theme.background};
`;
