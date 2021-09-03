import React, {FC} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {IconProps} from 'react-native-vector-icons/Icon';
import styled from 'styled-components';

export interface BaseIconPropsType extends IconProps {
  active?: boolean;
}

const BaseIcon: FC<BaseIconPropsType> = props => {
  const {active, ...IconProps} = props;
  return <StyledIcon active={active} {...IconProps} />;
};

export default BaseIcon;

const StyledIcon = styled(Icon)<{active?: boolean}>`
  color: ${({theme, active}) => (active ? theme.primary : theme.text)};
`;
