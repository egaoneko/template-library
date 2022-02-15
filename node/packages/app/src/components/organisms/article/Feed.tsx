import { IArticle } from '@my-app/core/lib/interfaces/article';
import React, { FC } from 'react';
import styled from 'styled-components/native';
import format from 'date-fns/format';

import BaseText from 'src/components/atoms/text/BaseText';
import TouchableView from 'src/components/atoms/view/TouchableView';
import BaseIcon from 'src/components/atoms/icon/BaseIcon';
import Avatar from 'src/components/atoms/avatar/Avatar';
import IconButton from 'src/components/atoms/button/IconButton';
import { Description, Heading2 } from 'src/components/atoms/common/typography';

interface PropsType {
  article: IArticle;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
  moveToArticle: (slag: string) => void;
  moveToAuthor: (username: string) => void;
}

const Feed: FC<PropsType> = ({ article, toggleFavorite, moveToArticle, moveToAuthor }) => {
  return (
    <Container onPress={() => moveToArticle(article.slug)}>
      <ContentContainer>
        <Heading2>{article.title}</Heading2>
        <AuthorContainer onPress={() => moveToAuthor(article.author.username)}>
          <Avatar uri={article.author.image} size={15} />
          <AuthorDescription>{article.author.username}</AuthorDescription>
          <AuthorDescription>{'\u00B7'}</AuthorDescription>
          <AuthorDescription>{format(new Date(article.updatedAt), 'EEE MMM d yyyy')}</AuthorDescription>
        </AuthorContainer>
        <ContentMoreButton name="ellipsis1" size={15} onPress={() => moveToArticle(article.slug)} />
      </ContentContainer>
      <FavoriteWrapper>
        <FavoriteContainer onPress={() => toggleFavorite(article.slug, !article.favorited)}>
          <BaseIcon name="heart" size={15} active={article.favorited} />
          <FavoriteCount active={article.favorited}>{article.favoritesCount}</FavoriteCount>
        </FavoriteContainer>
      </FavoriteWrapper>
    </Container>
  );
};

export default Feed;

const Container = styled(TouchableView)`
  height: 120px;
  flex-grow: 0;
  flex-direction: row;
  padding: 20px 16px;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: 0 5px;
`;

const AuthorContainer = styled(TouchableView)`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const AuthorDescription = styled(Description)`
  margin: 0 3px;
`;

const ContentMoreButton = styled(IconButton)`
  margin-top: 12px;
  color: ${({ theme }) => theme.description};
`;

const FavoriteWrapper = styled.View`
  width: 80px;
  height: 100%;
  justify-content: center;
`;

const FavoriteContainer = styled(TouchableView)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const FavoriteCount = styled(BaseText)`
  margin-left: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 1px;
`;
