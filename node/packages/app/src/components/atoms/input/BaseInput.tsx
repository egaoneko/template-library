import React, { FC } from 'react';
import { TextStyle } from 'react-native';
import { StyledProps } from 'styled-components';
import styled from 'styled-components/native';
import { Colors } from 'react-native-paper';

interface PropsType extends StyledProps<TextStyle> {}

const BaseInput: FC<PropsType> = props => {
  const { children, ...inputProps } = props;

  return <StyledInput {...inputProps}>{children}</StyledInput>;
};

export default BaseInput;

const StyledInput = styled.TextInput`
  width: 100%;
  border-width: 1px;
  border-color: ${Colors.grey500};
  margin-top: 8px;
  margin-bottom: 8px;
`;
