import React, {FC} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
// eslint-disable-next-line import/order
import styled from 'styled-components';

// eslint-disable-next-line import/no-unresolved
import {IconProps} from 'react-native-vector-icons/Icon';

export interface BaseIconPropsType extends IconProps {
  active?: boolean;
}

const BaseIcon: FC<BaseIconPropsType> = props => {
  const {active, ...props} = props;
  return <StyledIcon active={active} {...props} />;
};

export default BaseIcon;

const StyledIcon = styled(Icon)<{active?: boolean}>`
  color: ${({theme, active}) => (active ? theme.primary : theme.text)};
`;
