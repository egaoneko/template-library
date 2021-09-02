import React, {FC} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {IconProps} from 'react-native-vector-icons/Icon';
import {COLOR_SET} from '../../../enums/color';
import useDarkMode from '../../../hooks/useDarkMode';

export interface IconPropsType extends IconProps {
  name: string;
  size: number;
  active?: boolean;
}

const DarkModeIcon: FC<IconPropsType> = props => {
  const {onPress, active, ...IconProps} = props;
  return (
    <Icon
      color={
        active
          ? COLOR_SET.PRIMARY
          : useDarkMode()
          ? COLOR_SET.DARK_MODE_TEXT
          : COLOR_SET.LIGHT_MODE_TEXT
      }
      {...IconProps}
    />
  );
};

export default DarkModeIcon;
