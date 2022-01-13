import React, { FC } from 'react';
import styled from 'styled-components/native';

import { TouchableProps } from '../../../interfaces/component';
import BaseIcon, { BaseIconPropsType } from '../icon/BaseIcon';

interface PropsType extends BaseIconPropsType, TouchableProps {}

const IconButton: FC<PropsType> = props => {
  const { onPress, onPressIn, onPressOut, ...IconProps } = props;
  return (
    <Container onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <BaseIcon {...IconProps} />
    </Container>
  );
};

export default IconButton;

const Container = styled.TouchableOpacity``;
