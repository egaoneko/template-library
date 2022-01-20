import styled from 'styled-components/native';

import BaseText from 'src/components/atoms/text/BaseText';

export const Heading1 = styled(BaseText)`
  font-family: ${({ theme }) => theme.font};
  font-size: 25px;
  font-weight: 700;
`;

export const Heading2 = styled(BaseText)`
  font-family: ${({ theme }) => theme.font};
  font-size: 20px;
  font-weight: 500;
`;

export const Description1 = styled(BaseText)`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.description};
`;
