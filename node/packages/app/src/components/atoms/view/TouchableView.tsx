import React, {ComponentProps, FC, ReactNode} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {TouchableProps} from '../../../interfaces/component';

interface PropsType extends ComponentProps<typeof View>, TouchableProps {
  children?: ReactNode;
}

const TouchableView: FC<PropsType> = props => {
  const {onPress, onPressIn, onPressOut, children, ...viewProps} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <View {...viewProps}>{children}</View>
    </TouchableOpacity>
  );
};

export default TouchableView;
