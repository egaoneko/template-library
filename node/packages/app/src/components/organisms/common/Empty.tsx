import React, { FC } from 'react';
import styled from 'styled-components/native';

import { Heading1 } from 'src/components/atoms/common/typography';

interface Props {
  children: string;
}

const Empty: FC<Props> = ({ children }) => {
  return (
    <Container>
      <Heading1>{children}</Heading1>
    </Container>
  );
};

export default Empty;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
