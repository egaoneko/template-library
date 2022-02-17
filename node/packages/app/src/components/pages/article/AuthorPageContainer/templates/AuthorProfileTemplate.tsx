import React, { FC } from 'react';
import styled, { css } from 'styled-components/native';
import { IProfile } from '@my-app/core/lib/interfaces/profile';
import { Colors } from 'react-native-paper';
import { IUser } from '@my-app/core/lib/interfaces/user';

import Avatar from 'src/components/atoms/avatar/Avatar';
import { Body18 } from 'src/components/atoms/common/typography';
import BaseView from 'src/components/atoms/view/BaseView';
import BaseIcon from 'src/components/atoms/icon/BaseIcon';
import TouchableView from 'src/components/atoms/view/TouchableView';

interface PropsType {
  disabled?: boolean;
  user: IUser | null;
  author: IProfile;
  toggleFollow: (toggle: boolean) => Promise<unknown>;
}

const AuthorProfileTemplate: FC<PropsType> = ({ disabled, user, author, toggleFollow }) => {
  return (
    <Profile>
      <Avatar size={180} uri={author.image} />
      <Body18>{author.username}</Body18>
      <ActionsContainer>
        {user?.username !== author.username && (
          <FollowContainer
            onPress={() => toggleFollow(!author.following)}
            active={author.following}
            disabled={disabled}
          >
            <FollowIcon name={author.following ? 'minus' : 'plus'} size={15} active={author.following} />
            <FollowText active={author.following}>{author.following ? 'Unfollow' : 'Follow'}</FollowText>
          </FollowContainer>
        )}
      </ActionsContainer>
    </Profile>
  );
};

export default AuthorProfileTemplate;

const Profile = styled(BaseView)`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 30px 10px;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  margin-top: 16px;
`;

const ActionContainer = styled(TouchableView)<{ disabled?: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
  flex-direction: row;
  align-items: center;
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

const ActionText = styled.Text`
  margin-left: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 1px;
`;

const FollowContainer = styled(ActionContainer)<{ active?: boolean }>`
  ${({ theme, active }) =>
    active
      ? css`
          background-color: ${theme.primary};
        `
      : css`
          border: 1px solid ${theme.primary};
        `}
`;

const FollowIcon = styled(BaseIcon)<{ active?: boolean }>`
  ${({ theme, active }) =>
    active
      ? css`
          color: ${Colors.white};
        `
      : css`
          color: ${theme.primary};
        `}
`;

const FollowText = styled(ActionText)<{ active?: boolean }>`
  ${({ theme, active }) =>
    active
      ? css`
          color: ${Colors.white};
        `
      : css`
          color: ${theme.primary};
        `}
`;
