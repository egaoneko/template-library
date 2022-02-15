import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { Colors } from 'react-native-paper';

import { InputError } from 'src/components/atoms/common/typography';

export type BaseInputPropsType = Pick<
  TextInputProps,
  | 'autoFocus'
  | 'placeholder'
  | 'secureTextEntry'
  | 'multiline'
  | 'numberOfLines'
  | 'returnKeyType'
  | 'onSubmitEditing'
  | 'onChangeText'
  | 'onBlur'
  | 'value'
> & {
  children: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
};

const BaseInput = forwardRef<TextInput, BaseInputPropsType>((props, ref) => {
  const { error, errorMessage, ...inputProps } = props;
  return (
    <>
      <StyledInput ref={ref} error={error} {...inputProps} />
      {error && <InputError>{errorMessage}</InputError>}
    </>
  );
});

export default BaseInput;

const StyledInput = styled.TextInput<{ error?: boolean }>`
  width: 100%;
  border-width: 1px;
  border-color: ${({ error, theme }) => (error ? theme.error : Colors.grey500)};
  margin-top: 8px;
  margin-bottom: 8px;
`;
