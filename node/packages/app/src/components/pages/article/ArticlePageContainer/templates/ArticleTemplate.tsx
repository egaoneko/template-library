import { IArticle } from '@my-app/core/lib/interfaces/article';
import React, { FC } from 'react';
import styled, { css } from 'styled-components/native';
import format from 'date-fns/format';
import Markdown from 'react-native-markdown-display';
import { Colors } from 'react-native-paper';
import { IUser } from '@my-app/core/lib/interfaces/user';

import TouchableView from 'src/components/atoms/view/TouchableView';
import BaseIcon from 'src/components/atoms/icon/BaseIcon';
import Avatar from 'src/components/atoms/avatar/Avatar';
import { Body18, Description16, Heading1 } from 'src/components/atoms/common/typography';

interface PropsType {
  user: IUser | null;
  disabled?: boolean;
  article: IArticle;
  toggleFollow: (username: string, toggle: boolean) => Promise<unknown>;
  toggleFavorite: (toggle: boolean) => Promise<unknown>;
  moveToAuthor: (username: string) => void;
  onDelete: () => Promise<unknown>;
  moveToEdit: () => void;
}

const ArticleTemplate: FC<PropsType> = ({
  user,
  disabled,
  article,
  toggleFollow,
  toggleFavorite,
  moveToAuthor,
  onDelete,
  moveToEdit,
}) => {
  return (
    <Container>
      <HeaderContainer>
        <Heading1>{article.title}</Heading1>
        <AuthorContainer onPress={() => moveToAuthor(article.author.username)}>
          <Avatar uri={article.author.image} size={50} />
          <AuthorDescriptionContainer>
            <AuthorDescription>{article.author.username}</AuthorDescription>
            <AuthorDescription>{format(new Date(article.updatedAt), 'EEE MMM d yyyy')}</AuthorDescription>
          </AuthorDescriptionContainer>
        </AuthorContainer>
        <ActionsContainer>
          {user?.username === article.author.username ? (
            <>
              <EditContainer onPress={moveToEdit} disabled={disabled}>
                <EditIcon name="edit" size={15} />
                <EditText>Edit</EditText>
              </EditContainer>
              <DeleteContainer onPress={onDelete} disabled={disabled}>
                <DeleteIcon name="delete" size={15} />
                <DeleteText>Delete</DeleteText>
              </DeleteContainer>
            </>
          ) : (
            <>
              <FollowContainer
                onPress={() => toggleFollow(article.author.username, !article.author.following)}
                active={article.author.following}
                disabled={disabled}
              >
                <FollowIcon
                  name={article.author.following ? 'minus' : 'plus'}
                  size={15}
                  active={article.author.following}
                />
                <FollowText active={article.author.following}>
                  {article.author.following ? 'Unfollow' : 'Follow'}
                </FollowText>
              </FollowContainer>
              <FavoriteContainer
                onPress={() => toggleFavorite(!article.favorited)}
                active={article.favorited}
                disabled={disabled}
              >
                <FavoriteIcon name="heart" size={15} active={article.favorited} />
                <FavoriteText active={article.favorited}>
                  {article.favorited ? 'Unfavorite' : 'Favorite'} ({article.favoritesCount})
                </FavoriteText>
              </FavoriteContainer>
            </>
          )}
        </ActionsContainer>
      </HeaderContainer>
      <ContentContainer contentInsetAdjustmentBehavior="automatic">
        <Content>
          <Markdown>{article.body}</Markdown>
        </Content>
      </ContentContainer>
    </Container>
  );
};

export default ArticleTemplate;

const Container = styled.View`
  width: 100%;
  padding: 20px 16px;
`;

const HeaderContainer = styled.View`
  padding: 0 5px;
`;

const ContentContainer = styled.ScrollView`
  padding: 0 5px;
`;

const AuthorContainer = styled(TouchableView)`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const AuthorDescriptionContainer = styled.View`
  justify-content: center;
  margin-left: 20px;
`;

const AuthorDescription = styled(Description16)`
  margin: 0 3px;
`;

const Content = styled(Body18)`
  margin-top: 12px;
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

const EditContainer = styled(ActionContainer)`
  background-color: ${({ theme }) => theme.secondary};
`;

const EditIcon = styled(BaseIcon)`
  color: ${Colors.white};
`;

const EditText = styled(ActionText)`
  color: ${Colors.white};
`;

const DeleteContainer = styled(ActionContainer)`
  margin-left: 8px;
  background-color: ${({ theme }) => theme.error};
`;

const DeleteIcon = styled(BaseIcon)`
  color: ${Colors.white};
`;

const DeleteText = styled(ActionText)`
  color: ${Colors.white};
`;

const FollowContainer = styled(ActionContainer)<{ active?: boolean }>`
  ${({ theme, active }) =>
    active
      ? css`
          background-color: ${theme.description};
        `
      : css`
          border: 1px solid ${theme.description};
        `}
`;

const FollowIcon = styled(BaseIcon)<{ active?: boolean }>`
  ${({ theme, active }) =>
    active
      ? css`
          color: ${Colors.white};
        `
      : css`
          color: ${theme.description};
        `}
`;

const FollowText = styled(ActionText)<{ active?: boolean }>`
  ${({ theme, active }) =>
    active
      ? css`
          color: ${Colors.white};
        `
      : css`
          color: ${theme.description};
        `}
`;

const FavoriteContainer = styled(ActionContainer)<{ active?: boolean }>`
  margin-left: 8px;
  ${({ theme, active }) =>
    active
      ? css`
          background-color: ${theme.primary};
        `
      : css`
          border: 1px solid ${theme.primary};
        `}
`;

const FavoriteIcon = styled(BaseIcon)<{ active?: boolean }>`
  ${({ theme, active }) =>
    active
      ? css`
          color: ${Colors.white};
        `
      : css`
          color: ${theme.primary};
        `}
`;

const FavoriteText = styled(ActionText)<{ active?: boolean }>`
  ${({ theme, active }) =>
    active
      ? css`
          color: ${Colors.white};
        `
      : css`
          color: ${theme.primary};
        `}
`;
