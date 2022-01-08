import {IArticle} from '@my-app/core/lib/interfaces/article';
import React, {FC} from 'react';
import styled from 'styled-components/native';
import format from 'date-fns/format';
import BaseText from '../../atoms/text/BaseText';
import TouchableView from '../../atoms/view/TouchableView';
import BaseIcon from '../../atoms/icon/BaseIcon';
import Avatar from '../../atoms/avatar/Avatar';
import IconButton from '../../atoms/button/IconButton';
import {Description1, Heading2} from '../../atoms/common/typography';

interface PropsType {
  article: IArticle;
}

const Feed: FC<PropsType> = ({article}) => {
  return (
    <Container>
      <ContentContainer>
        <Heading2>{article.title}</Heading2>
        <AuthorContainer>
          <Avatar uri={article.author.image} size={15} />
          <AuthorDescription>{article.author.username}</AuthorDescription>
          <AuthorDescription>{'\u00B7'}</AuthorDescription>
          <AuthorDescription>
            {format(new Date(article.updatedAt), 'EEE MMM d yyyy')}
          </AuthorDescription>
        </AuthorContainer>
        <ContentMoreButton name="ellipsis1" size={15} />
      </ContentContainer>
      <FavoriteWrapper>
        <FavoriteContainer>
          <BaseIcon name="heart" size={15} active={article.favorited} />
          <FavoriteCount active={article.favorited}>
            {article.favoritesCount}
          </FavoriteCount>
        </FavoriteContainer>
      </FavoriteWrapper>
    </Container>
  );
};

export default Feed;

const Container = styled(TouchableView)`
  flex: 1;
  flex-direction: row;
  padding: 20px 10px;
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

const AuthorDescription = styled(Description1)`
  margin: 0 3px;
`;

const ContentMoreButton = styled(IconButton)`
  margin-top: 12px;
  color: ${({theme}) => theme.description};
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