import React, { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Link from 'next/link';
import { AiOutlineEdit, AiOutlineSetting } from 'react-icons/ai';

import { useStores } from 'src/stores/stores';
import Menus from 'src/components/atoms/menu/Menus';
import Menu from 'src/components/atoms/menu/Menu';
import Avatar from 'src/components/atoms/avatar/Avatar';

interface PropsType {
  pathname?: string | null;
}

const HeaderTemplate: FC<PropsType> = props => {
  const { userStore } = useStores();

  return (
    <Container>
      <Heading>
        <HeadingTitle data-cy="header-logo-link">
          <Link href="/">conduit</Link>
        </HeadingTitle>
        <Menus>
          <Menu key="home" href="/" data-cy="header-home-link">
            Home
          </Menu>
          {!userStore.user ? (
            <>
              <Menu
                key="sign-in"
                href="/auth/sign-in"
                active={props.pathname === '/auth/sign-in'}
                data-cy="header-sign-in-link"
              >
                Sign in
              </Menu>
              <Menu
                key="sign-up"
                href="/auth/sign-up"
                active={props.pathname === '/auth/sign-up'}
                data-cy="header-sign-up-link"
              >
                Sign up
              </Menu>
            </>
          ) : (
            <>
              <Menu
                key="new"
                href="/editor/new"
                icon={<AiOutlineEdit />}
                active={props.pathname === '/editor/new'}
                data-cy="header-new-post-link"
              >
                New Post
              </Menu>
              <Menu
                key="settings"
                href="/user/settings"
                icon={<AiOutlineSetting />}
                active={props.pathname === '/user/settings'}
                data-cy="header-settings-link"
              >
                Settings
              </Menu>
              <Menu
                key="profile"
                href={`/profile/${userStore.user.username}`}
                active={props.pathname === `/profile/${userStore.user.username}`}
                data-cy="header-profile-link"
              >
                <div className="flex items-center gap-1">
                  <Avatar size="small" url={userStore.user.image} />
                  {userStore.user.username}
                </div>
              </Menu>
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
