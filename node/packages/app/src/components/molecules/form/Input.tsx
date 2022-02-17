import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';
import { Controller, FieldValues } from 'react-hook-form';

import BaseInput, { BaseInputPropsType } from 'src/components/atoms/input/BaseInput';

export interface InputProps extends FieldValues, BaseInputPropsType {}

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    autoFocus,
    secureTextEntry,
    multiline,
    numberOfLines,
    placeholder,
    returnKeyType,
    onSubmitEditing,
    error,
    errorMessage,
    style,
    ...rest
  } = props;

  return (
    <Controller
      {...rest}
      render={({ field: { onChange, onBlur, value } }) => (
        <BaseInput
          ref={ref}
          autoFocus={autoFocus}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          error={error}
          errorMessage={errorMessage}
          onSubmitEditing={onSubmitEditing}
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          style={style}
        />
      )}
    />
  );
});

export default Input;
