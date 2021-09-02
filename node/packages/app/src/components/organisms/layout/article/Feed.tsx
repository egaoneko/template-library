import {IArticle} from '@my-app/core/lib/interfaces/article';
import React, {FC} from 'react';
import styled from 'styled-components/native';
import format from 'date-fns/format';
import {Colors} from 'react-native-paper';
import DarkModeText from '../../../atoms/text/DarkModeText';
import TouchableText from '../../../atoms/text/TouchableText';
import TouchableView from '../../../atoms/view/TouchableView';
import DarkModeIcon from '../../../atoms/button/DarkModeIcon';
import Avatar from '../../../atoms/avatar/Avatar';
import useDarkMode from '../../../../hooks/useDarkMode';
import IconButton from '../../../atoms/button/IconButton';
import {FONT_SET} from '../../../../enums/font';

interface PropsType {
  article: IArticle;
}

const Feed: FC<PropsType> = ({article}) => {
  const isDarkMode = useDarkMode();
  return (
    <Container>
      <ContentContainer>
        <Title>{article.title}</Title>
        <AuthorContainer>
          <Avatar uri={article.author.image} size={15} />
          <AuthorDescription darkMode={isDarkMode}>
            {article.author.username}
          </AuthorDescription>
          <AuthorDescription darkMode={isDarkMode}>
            {'\u00B7'}
          </AuthorDescription>
          <AuthorDescription darkMode={isDarkMode}>
            {format(new Date(article.updatedAt), 'EEE MMM d yyyy')}
          </AuthorDescription>
        </AuthorContainer>
        <ContentMoreButton darkMode={isDarkMode} name="ellipsis1" size={15} />
      </ContentContainer>
      <FavoriteWrapper>
        <FavoriteContainer>
          <DarkModeIcon name="heart" size={15} active={article.favorited} />
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

const Title = styled(TouchableText)`
  font-size: 20px;
  font-weight: 600;
`;

const AuthorContainer = styled(TouchableView)`
  flex-direction: row;
  margin-top: 10px;
`;

const AuthorDescription = styled.Text<{darkMode: boolean}>`
  font-family: ${FONT_SET.BASE_FONT};
  margin: 0 3px;
  font-size: 13px;
  font-weight: 400;
  color: ${({darkMode}) => (darkMode ? Colors.grey300 : Colors.grey600)};
`;

const ContentMoreButton = styled(IconButton)<{darkMode: boolean}>`
  margin-top: 12px;
  color: ${({darkMode}) => (darkMode ? Colors.grey300 : Colors.grey600)};
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

const FavoriteCount = styled(DarkModeText)`
  margin-left: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 1px;
`;
