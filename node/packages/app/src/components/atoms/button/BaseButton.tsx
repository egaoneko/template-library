import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Colors } from 'react-native-paper';

import { TouchableProps } from 'src/interfaces/component';
import BaseText from 'src/components/atoms/text/BaseText';

interface PropsType extends TouchableProps {
  title: string;
}

const BaseButton: FC<PropsType> = props => {
  const { title, onPress, onPressIn, onPressOut } = props;
  return (
    <Container onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Title>{title}</Title>
    </Container>
  );
};

export default BaseButton;

const Container = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.primary};
  padding: 16px 20px;
  border-radius: 8px;
`;

const Title = styled(BaseText)`
  font-family: ${({ theme }) => theme.font};
  font-size: 20px;
  font-weight: 700;
  color: ${Colors.white};
`;
