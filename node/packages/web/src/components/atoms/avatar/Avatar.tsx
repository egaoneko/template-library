/* eslint-disable  @next/next/no-img-element */

import React, { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

const DEFAULT_IMAGE = 'https://static.productionready.io/images/smiley-cyrus.jpg';

interface PropsType {
  url?: string;
  size?: 'small' | 'middle' | 'large';
}

const Avatar: FC<PropsType> = props => {
  const { url, size, ...wrapperProps } = props;
  let width: number;

  switch (props.size) {
    case 'small':
      width = 5;
      break;
    case 'large':
      width = 32;
      break;
    case 'middle':
    default:
      width = 8;
      break;
  }

  return (
    <Wrapper {...wrapperProps}>
      <Container className={`w-${width} h-${width}`}>
        <Img className="rounded-full" src={props.url ?? DEFAULT_IMAGE} alt="avatar" />
      </Container>
    </Wrapper>
  );
};

export default Avatar;

const Wrapper = styled.div`
  ${tw`flex flex-row justify-center`}
`;

const Container = styled.div`
  ${tw`relative flex justify-center items-center rounded-full`}
`;

const Img = styled.img`
  ${tw`rounded-full`}
`;
