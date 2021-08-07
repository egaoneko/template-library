import Menu from '@components/atoms/menu/Menu';
import Menus from '@components/atoms/menu/Menus';
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Link from 'next/link';
import { useStores } from '@stores/stores';
import { AiOutlineEdit, AiOutlineSetting } from 'react-icons/ai';

interface PropsType {
  headingTitle: string;
  bannerTitle?: string;
  bannerDescription?: string;
  bannerColor?: string;
  children?: ReactNode;
}

const HeaderTemplates: FC<PropsType> = props => {
  const { userStore } = useStores();

  return (
    <Container>
      <Heading>
        <HeadingTitle>
          <Link href="/">{props.headingTitle}</Link>
        </HeadingTitle>
        <Menus>
          <Menu href="/">Home</Menu>
          {!userStore.user && (
            <>
              <Menu href="/sign-in">Sign in</Menu>
              <Menu href="/sign-up">Sign up</Menu>
            </>
          )}
          {userStore.user && (
            <>
              <Menu href="/" icon={<AiOutlineEdit />}>
                New Post
              </Menu>
              <Menu href="/" icon={<AiOutlineSetting />}>
                Settings
              </Menu>
              <Menu href="/">{userStore.user.username}</Menu>
            </>
          )}
        </Menus>
      </Heading>
      {props.bannerTitle && (
        <Banner className={props.bannerColor ?? 'bg-green-600'}>
          <BannerTitle>{props.bannerTitle}</BannerTitle>
          <BannerDescription>{props.bannerDescription}</BannerDescription>
        </Banner>
      )}
    </Container>
  );
};

export default HeaderTemplates;

const Container = styled.div`
  ${tw`max-w-full select-none mb-8`}
`;

const Heading = styled.div`
  ${tw`max-w-full px-32 py-2 flex justify-between`}
`;

const HeadingTitle = styled.div`
  ${tw`font-bold text-2xl text-green-600 font-sans flex items-center`}
`;

const Banner = styled.div`
  ${tw`max-w-full p-8 mb-8`}
  box-shadow: inset 0 8px 8px -8px rgb(0 0 0 / 30%), inset 0 -8px 8px -8px rgb(0 0 0 / 30%);
`;

const BannerTitle = styled.h1`
  ${tw`font-bold text-6xl text-white text-center font-sans pb-2`}
  text-shadow: 0 1px 3px rgb(0 0 0 / 30%);
`;

const BannerDescription = styled.p`
  ${tw`text-2xl text-white text-center font-sans mb-0`}
`;
