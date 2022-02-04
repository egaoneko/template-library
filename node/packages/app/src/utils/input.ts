import React from 'react';
import { TextInput } from 'react-native';

export function handleFocusNext(inputRefs: Array<React.RefObject<TextInput>>, index: number): void {
  if (inputRefs[index + 1] && index < inputRefs.length - 1) {
    inputRefs[index + 1].current?.focus();
  }

  if (inputRefs[index + 1] && index === inputRefs.length - 1) {
    inputRefs[index].current?.blur();
  }
}
