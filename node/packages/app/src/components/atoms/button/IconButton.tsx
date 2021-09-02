import React, {FC} from 'react';
import styled from 'styled-components/native';
import {TouchableProps} from '../../../interfaces/component';
import DarkModeIcon, {IconPropsType} from './DarkModeIcon';

interface PropsType extends IconPropsType, TouchableProps {}

const IconButton: FC<PropsType> = props => {
  const {onPress, onPressIn, onPressOut, ...IconProps} = props;
  return (
    <Container onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <DarkModeIcon {...IconProps} />
    </Container>
  );
};

export default IconButton;

const Container = styled.TouchableOpacity``;
