import React, { FC } from 'react';
import styled, { css } from 'styled-components/native';
import { Colors } from 'react-native-paper';

import { TouchableProps } from 'src/interfaces/component';
import BaseText from 'src/components/atoms/text/BaseText';

export enum ButtonVariant {
  Filled = 'filled',
  Outlined = 'outlined',
}

export enum ButtonSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

interface PropsType extends TouchableProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

const BaseButton: FC<PropsType> = props => {
  const {
    title,
    variant = ButtonVariant.Filled,
    size = ButtonSize.Medium,
    disabled = false,
    onPress,
    onPressIn,
    onPressOut,
  } = props;
  return (
    <Container
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      variant={variant}
      size={size}
    >
      <Title variant={variant} size={size}>
        {title}
      </Title>
    </Container>
  );
};

export default BaseButton;

const Container = styled.TouchableOpacity<{ variant: ButtonVariant; size: ButtonSize; disabled?: boolean }>`
  border-radius: 8px;
  ${({ variant, theme }) =>
    variant === ButtonVariant?.Filled
      ? css`
          background-color: ${theme.primary};
        `
      : css`
          border: 1px solid ${theme.primary};
        `}
  ${({ size }) => {
    switch (size) {
      case ButtonSize.Small:
        return css`
          padding: 8px 12px;
        `;
      case ButtonSize.Large:
        return css`
          padding: 16px 24px;
        `;
      default:
        return css`
          padding: 12px 16px;
        `;
    }
  }}
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
}
`;

const Title = styled(BaseText)<{ variant: ButtonVariant; size: ButtonSize }>`
  font-family: ${({ theme }) => theme.font};
  font-weight: 700;
  color: ${Colors.white};
  ${({ variant, theme }) =>
    variant === ButtonVariant?.Filled
      ? css`
          color: ${Colors.white};
        `
      : css`
          color: ${theme.primary};
        `}
  ${({ size }) => {
    switch (size) {
      case ButtonSize.Small:
        return css`
          font-size: 16px;
        `;
      case ButtonSize.Large:
        return css`
          font-size: 24px;
        `;
      default:
        return css`
          font-size: 20px;
        `;
    }
  }}
}
`;
