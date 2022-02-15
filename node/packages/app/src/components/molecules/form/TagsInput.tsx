import React, { forwardRef, useRef, useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import styled from 'styled-components/native';

import BaseInput from 'src/components/atoms/input/BaseInput';
import Chip from 'src/components/molecules/common/Chip';

export interface InputProps extends Omit<InputProps, 'secureTextEntry' | 'multiline' | 'numberOfLines'> {}

const TagsInput = forwardRef<TextInput, InputProps>((props, ref) => {
  const { autoFocus, placeholder, returnKeyType, onSubmitEditing, error, errorMessage, ...rest } = props;
  const [currentTag, setCurrentTag] = useState<string>('');
  const tagsRef = useRef<ScrollView>(null);

  return (
    <Controller
      {...rest}
      render={({ field: { onChange, onBlur, value } }) => {
        const handleChange = (text: string) => {
          const last = text.charAt(text.length - 1);

          if (last === ',') {
            const tag = currentTag.substring(0, text.length - 1);
            if (value && (value as string[]).indexOf(tag) === -1) {
              onChange([...(value ?? []), tag]);
            }
            setCurrentTag('');
          } else {
            setCurrentTag(text);
          }
          tagsRef.current?.scrollToEnd?.({ animated: true });
        };

        const handleDelete = (tag: string) => {
          onChange((value as string[]).filter(t => t !== tag));
        };

        return (
          <>
            <BaseInput
              ref={ref}
              autoFocus={autoFocus}
              placeholder={placeholder}
              returnKeyType={returnKeyType}
              error={error}
              errorMessage={errorMessage}
              onSubmitEditing={onSubmitEditing}
              onChangeText={handleChange}
              onBlur={onBlur}
              value={currentTag}
            />
            <ChipsWrapper horizontal automaticallyAdjustContentInsets>
              <Chips>
                {(value as string[])?.map(val => (
                  <Chip key={val} tag={val} onDelete={handleDelete} />
                ))}
              </Chips>
            </ChipsWrapper>
          </>
        );
      }}
    />
  );
});

export default TagsInput;

const ChipsWrapper = styled.ScrollView`
  width: 100%;
`;

const Chips = styled.View`
  width: 100%;
  flex-direction: row;
  display: flex;
`;
