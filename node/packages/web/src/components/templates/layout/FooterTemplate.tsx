import React, { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Link from 'next/link';

interface PropsType {}

const FooterTemplate: FC<PropsType> = () => {
  return (
    <Container>
      <Link href="/" passHref>
        <SiteLink className="text-base mr-1 font-bold" data-cy="footer-logo-link">
          conduit
        </SiteLink>
      </Link>
      © 2020. An interactive learning project from
      <Link href="https://thinkster.io/" passHref>
        <SiteLink className="ml-1" data-cy="footer-site-link">
          Thinkster
        </SiteLink>
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
