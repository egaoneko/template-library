import React, { FC } from 'react';
import styled from 'styled-components/native';
import format from 'date-fns/format';
import { CreateCommentRequest, IComment } from '@my-app/core/lib/interfaces/comment';
import { Colors } from 'react-native-paper';
import { IUser } from '@my-app/core/lib/interfaces/user';

import TouchableView from 'src/components/atoms/view/TouchableView';
import Avatar from 'src/components/atoms/avatar/Avatar';
import { Body18, Description13 } from 'src/components/atoms/common/typography';
import BaseIcon from 'src/components/atoms/icon/BaseIcon';

interface PropsType {
  user: IUser | null;
  comment: IComment;
  moveToAuthor: (username: string) => void;
  onDelete: (id: number) => Promise<unknown>;
}

const Comment: FC<PropsType> = ({ user, comment, moveToAuthor, onDelete }) => {
  return (
    <Wrapper>
      <Container>
        <Header>
          <AuthorContainer onPress={() => moveToAuthor(comment.author.username)}>
            <Avatar uri={comment.author.image} size={30} />
            <AuthorDescription>{comment.author.username}</AuthorDescription>
            <AuthorDescription>{'\u00B7'}</AuthorDescription>
            <AuthorDescription>{format(new Date(comment.updatedAt), 'EEE MMM d yyyy')}</AuthorDescription>
          </AuthorContainer>
          {user?.username === comment.author.username && (
            <DeleteIcon name="delete" size={15} onPress={() => onDelete(comment.id)} />
          )}
        </Header>
        <Content>
          <Body18>{comment.body}</Body18>
        </Content>
      </Container>
    </Wrapper>
  );
};

export default Comment;

const Wrapper = styled.View`
  height: 120px;
  flex-grow: 0;
  padding: 20px 16px;
`;

const Container = styled.View`
  display: flex;
  border-radius: 8px;
  border: 1px solid ${Colors.grey400};
`;

const Header = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.grey400};
  background-color: ${Colors.grey300};
`;

const AuthorContainer = styled(TouchableView)`
  flex-direction: row;
  align-items: center;
`;

const AuthorDescription = styled(Description13)`
  margin: 0 3px;
`;

const DeleteIcon = styled(BaseIcon)`
  color: ${Colors.red500};
`;

const Content = styled.View`
  padding: 8px 20px 16px 20px;
`;
