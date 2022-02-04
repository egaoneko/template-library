import React, { FC } from 'react';
import styled from 'styled-components/native';

import BaseView from 'src/components/atoms/view/BaseView';

interface PropTypes {
  size: string;
}

const Loading: FC<PropTypes> = props => {
  return (
    <Wrapper>
      <Container>
        <ActivityIndicator size={props.size} />
      </Container>
    </Wrapper>
  );
};

export default Loading;

const Wrapper = styled(BaseView)`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Container = styled(BaseView)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

const ActivityIndicator = styled.ActivityIndicator`
  color: ${({ theme }) => theme.primary};
`;
