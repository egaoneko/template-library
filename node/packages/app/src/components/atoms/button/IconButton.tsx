import React, {FC} from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {IconProps} from 'react-native-vector-icons/Icon';
import {useColorScheme} from 'react-native';
import {COLOR_SET} from '../../../enums/color';

interface PropsType extends IconProps {
  name: string;
  size: number;
  onPress?: () => void;
}

const IconButton: FC<PropsType> = props => {
  const isDarkMode = useColorScheme() === 'dark';
  const {onPress, ...IconProps} = props;
  return (
    <Container onPress={props.onPress}>
      <Icon
        color={
          isDarkMode ? COLOR_SET.DARK_MODE_TEXT : COLOR_SET.LIGHT_MODE_TEXT
        }
        {...IconProps}
      />
    </Container>
  );
};

export default IconButton;

const Container = styled.TouchableOpacity``;
