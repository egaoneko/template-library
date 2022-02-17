import React, { FC } from 'react';
import styled from 'styled-components/native';
import { CreateCommentRequest } from '@my-app/core/lib/interfaces/comment';
import { Colors } from 'react-native-paper';
import { IUser } from '@my-app/core/lib/interfaces/user';
import { useForm } from 'react-hook-form';

import { Description13 } from 'src/components/atoms/common/typography';
import Avatar from 'src/components/atoms/avatar/Avatar';
import Input from 'src/components/molecules/form/Input';
import BaseButton, { ButtonSize } from 'src/components/atoms/button/BaseButton';

interface PropsType {
  user: IUser | null;
  onCreate: (request: CreateCommentRequest) => Promise<unknown>;
}

const CommentInputTemplate: FC<PropsType> = ({ user, onCreate }) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitted, errors },
  } = useForm<CreateCommentRequest>({
    defaultValues: {
      body: '',
    },
  });

  const handleCreate = async (data: CreateCommentRequest) => {
    await onCreate(data);
    reset();
  };

  return (
    <Wrapper>
      <Container>
        <Header>
          {user && (
            <AuthorContainer>
              <Avatar uri={user.image} size={30} />
              <AuthorDescription>{user.username}</AuthorDescription>
              <AuthorDescription>{'\u00B7'}</AuthorDescription>
            </AuthorContainer>
          )}
          <BaseButton title={'Post'} size={ButtonSize.Small} onPress={handleSubmit(handleCreate)} />
        </Header>
        <Content>
          <Input
            style={{ borderWidth: 0 }}
            control={control}
            rules={{ required: 'Comment body is required' }}
            name={'body'}
            error={isSubmitted && errors.body}
            errorMessage={errors.body?.message}
            placeholder="Comment"
            returnKeyType="done"
            onSubmitEditing={() => handleSubmit(handleCreate)}
          />
        </Content>
      </Container>
    </Wrapper>
  );
};

export default CommentInputTemplate;

const Wrapper = styled.View`
  flex-grow: 0;
  padding: 10px 16px;
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

const AuthorContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AuthorDescription = styled(Description13)`
  margin: 0 3px;
`;

const Content = styled.View`
  padding: 4px 16px;
`;
