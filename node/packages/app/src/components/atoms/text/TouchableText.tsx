import React, {FC} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {TouchableProps} from '../../../interfaces/component';
import TouchableView from '../view/TouchableView';
import DarkModeText, {TextPropsType} from './DarkModeText';

interface PropsType extends TextPropsType, TouchableProps {
  active?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
}

const TouchableText: FC<PropsType> = props => {
  const {viewStyle, children, onPress, onPressIn, onPressOut, ...textProps} =
    props;
  return (
    <TouchableView
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <DarkModeText {...textProps}>{children}</DarkModeText>
    </TouchableView>
  );
};

export default TouchableText;
