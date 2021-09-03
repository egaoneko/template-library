import React, {FC} from 'react';
import {TextStyle} from 'react-native';
import {StyledProps} from 'styled-components';
import styled from 'styled-components/native';
import {TouchableProps} from '../../../interfaces/component';
import TouchableView from '../view/TouchableView';

interface PropsType extends StyledProps<TextStyle>, TouchableProps {
  touchable?: boolean;
  active?: boolean;
}

const BaseText: FC<PropsType> = props => {
  const {
    children,
    touchable,
    active,
    onPress,
    onPressIn,
    onPressOut,
    ...textProps
  } = props;

  const text = <StyledText {...textProps}>{children}</StyledText>;
  return touchable ? (
    <TouchableView
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      {text}
    </TouchableView>
  ) : (
    text
  );
};

export default BaseText;
const StyledText = styled.Text<{active?: boolean}>`
  font-family: ${({theme}) => theme.font};
  color: ${({theme, active}) => (active ? theme.primary : theme.text)};
`;
