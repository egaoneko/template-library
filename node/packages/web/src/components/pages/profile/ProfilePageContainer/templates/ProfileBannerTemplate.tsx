import Avatar from '@components/atoms/avatar/Avatar';
import { IProfile } from '@my-app/core/lib/interfaces/profile';
import { IUser } from '@my-app/core/lib/interfaces/user';
import React, { FC } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';

interface PropsType {
  user: IUser | null;
  profileResult: UseQueryResult<IProfile>;
  toggleFollow: (username: string, toggle: boolean) => Promise<unknown>;
}

const ProfileBannerTemplate: FC<PropsType> = props => {
  const profile = props.profileResult.data;
  return (
    <Container>
      {profile && (
        <>
          <Avatar size="large" url={profile?.image} data-cy="profile-image" />
          <Title data-cy="profile-username">{profile.username}</Title>
          {props.user && props.user.username !== profile.username && (
            <Follow
              following={profile.following}
              onClick={() => props.toggleFollow(profile.username, !profile.following)}
              data-cy="profile-follow"
            >
              <div className="w-4 h-4">{profile.following ? <AiOutlineMinus /> : <AiOutlinePlus />}</div>
              <div>{profile.following ? 'Unfollow' : 'Follow'}</div>
            </Follow>
          )}
          <Description data-cy="profile-bio">{profile.bio} </Description>
        </>
      )}
    </Container>
  );
};

export default ProfileBannerTemplate;

const Container = styled.div`
  ${tw`max-w-full select-none pt-8 pb-4 bg-gray-200 text-center`}
`;

const Title = styled.h4`
  ${tw`font-bold text-2xl mt-4`}
`;

const Description = styled.div`
  ${tw`font-light text-base text-gray-400 mt-2 mb-2 px-12`}
`;

const Follow = styled.div<{ following: boolean }>`
  ${tw`inline-flex justify-center items-center cursor-pointer w-20 h-7 border border-gray-400 rounded text-sm mt-2`}
  ${({ following }) =>
    following ? tw`text-white bg-gray-500 hover:bg-gray-400` : tw`text-gray-400 hover:text-white hover:bg-gray-400`}
`;
