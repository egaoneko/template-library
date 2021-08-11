import Menu from '@components/atoms/menu/Menu';
import Menus from '@components/atoms/menu/Menus';
import React, { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Link from 'next/link';
import { useStores } from '@stores/stores';
import { AiOutlineEdit, AiOutlineSetting } from 'react-icons/ai';

interface PropsType {
  pathname?: string | null;
}

const HeaderTemplate: FC<PropsType> = props => {
  const { userStore } = useStores();

  return (
    <Container>
      <Heading>
        <HeadingTitle>
          <Link href="/">conduit</Link>
        </HeadingTitle>
        <Menus>
          <Menu href="/">Home</Menu>
          {!userStore.user && (
            <>
              <Menu href="/auth/sign-in">Sign in</Menu>
              <Menu href="/auth/sign-up">Sign up</Menu>
            </>
          )}
          {userStore.user && (
            <>
              <Menu href="/editor/new" icon={<AiOutlineEdit />}>
                New Post
              </Menu>
              <Menu href="/user/settings" icon={<AiOutlineSetting />} active={props.pathname === '/user/settings'}>
                Settings
              </Menu>
              <Menu href="/">{userStore.user.username}</Menu>
            </>
          )}
        </Menus>
      </Heading>
    </Container>
  );
};

export default HeaderTemplate;

const Container = styled.div`
  ${tw`container select-none mx-auto`}
`;

const Heading = styled.div`
  ${tw`py-2 flex justify-between`}
`;

const HeadingTitle = styled.div`
  ${tw`font-bold text-2xl text-primary font-sans flex items-center`}
`;
