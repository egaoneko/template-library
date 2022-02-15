import styled, { css } from 'styled-components/native';

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

export const Body18 = styled(BaseText)<{ bold?: boolean; color: string }>`
  font-family: ${({ theme }) => theme.font};
  font-size: 18px;
  font-weight: 500;
  ${({ bold }) =>
    bold &&
    css`
      font-weight: 700;
    `}
  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `}
`;

export const Description = styled(BaseText)`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.description};
`;

export const InputError = styled(BaseText)`
  font-family: ${({ theme }) => theme.font};
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.error};
  width: 100%;
`;

export const ButtonText18 = styled(BaseText)`
  font-family: ${({ theme }) => theme.font};
  font-size: 18px;
  font-weight: 500;
`;
