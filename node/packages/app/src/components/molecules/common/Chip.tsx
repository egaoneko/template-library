import React, { FC } from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';

import { Body18 } from 'src/components/atoms/common/typography';

interface PropTypes {
  tag: string;
  onDelete?: (tag: string) => void;
}

const Chip: FC<PropTypes> = props => {
  return (
    <Container onPress={props.onDelete}>
      <Body18 color="#fff">{props.tag}</Body18>
      <Close name="close" color="#fff" size={18} onPress={() => props.onDelete?.(props.tag)} />
    </Container>
  );
};

export default Chip;

const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.primary};
  margin: 4px;
  padding: 6px 12px;
  border-radius: 45px;
`;

const Close = styled(Icon)`
  margin-left: 4px;
  color: #fff;
`;
