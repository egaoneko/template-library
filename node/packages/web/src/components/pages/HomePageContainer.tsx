import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
interface PropsType {
  children?: ReactNode;
}

const HomePageContainer: FC<PropsType> = props => {
  return (
    <Heading>
      <div className="bg-gray-800">text</div>
    </Heading>
  );
};

export default HomePageContainer;

const Heading = styled.h1`
  ${tw`font-bold text-4xl text-blue-100 font-sans`}
`;
