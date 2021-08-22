import React, { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useStores } from '@stores/stores';
import Link from 'next/link';

interface PropsType {}

const FooterTemplate: FC<PropsType> = () => {
  const { userStore } = useStores();

  return (
    <Container>
      <Link href="/">
        <SiteLink className="text-base mr-1 font-bold">conduit</SiteLink>
      </Link>
      © 2020. An interactive learning project from
      <Link href="https://thinkster.io/">
        <SiteLink className="ml-1">Thinkster</SiteLink>
      </Link>
      . Code licensed under MIT.
    </Container>
  );
};

export default FooterTemplate;

const Container = styled.div`
  ${tw`w-full absolute bottom-0 mt-12 bg-gray-200 px-14 py-4 text-xs text-gray-400`}
`;

const SiteLink = styled.span`
  ${tw`text-primary hover:text-secondary hover:underline`}
`;
