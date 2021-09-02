import format from 'date-fns/format';
import Avatar from '@components/atoms/avatar/Avatar';
import Form from '@components/molecules/form/Form';
import Submit from '@components/molecules/form/Submit';
import Textarea from '@components/molecules/form/Textarea';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { CreateCommentRequest, IComment } from '@my-app/core/lib/interfaces/comment';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { IUser } from '@my-app/core/lib/interfaces/user';
import Link from 'next/link';
import React, { FC } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';
import { AiFillDelete } from 'react-icons/ai';

interface PropsType {
  loading?: boolean;
  user: IUser | null;
  articleResult: UseQueryResult<IArticle>;
  commentsResult: UseQueryResult<ListResult<IComment>>;
  onCreate: (slug: string, request: CreateCommentRequest) => Promise<unknown>;
  onDelete: (slug: string, id: number) => Promise<unknown>;
}

const ArticleCommentTemplate: FC<PropsType> = props => {
  const article = props.articleResult.data;
  const comments = props.commentsResult.data;
  const user = props.user;

  if (!article || !comments) {
    return null;
  }

  return (
    <Container>
      {user && (
        <FormContainer data-cy="comment-form-container">
          <Form
            resetAfterFinish
            gap={0}
            onFinish={async (request: CreateCommentRequest) => {
              await props.onCreate(article.slug, request);
            }}
          >
            <Textarea
              disabled={props.loading}
              name="body"
              placeholder="Write a comment..."
              rows={3}
              className="rounded-b-none"
              options={{ required: true }}
              data-cy="comment-form-input-text"
            />
            <FormInfo>
              <AuthorContainer>
                <Avatar size="small" url={user.image} data-cy="comment-form-user-image" />
                <AuthorName data-cy="comment-form-user-username">
                  <Link href={`/profile/${user.username}`}>{user.username}</Link>
                </AuthorName>
              </AuthorContainer>
              <Submit disabled={props.loading} size="small" className="ml-auto" data-cy="comment-form-user-submit">
                Post Comment
              </Submit>
            </FormInfo>
          </Form>
        </FormContainer>
      )}

      {comments.list.map(comment => (
        <CommentContainer data-cy="comment-container" key={comment.id}>
          <CommentBody data-cy="comment-body">{comment.body}</CommentBody>
          <CommentInfo>
            <AuthorContainer>
              <Avatar size="small" url={comment.author.image} data-cy="comment-author-image" />
              <AuthorName data-cy="comment-author-username">
                <Link href={`/profile/${comment.author.username}`}>{comment.author.username}</Link>
              </AuthorName>
              <AuthorDate data-cy="comment-author-date">
                {format(new Date(comment.updatedAt), 'EEE MMM d yyyy')}
              </AuthorDate>
            </AuthorContainer>
            {user?.username === comment.author.username && (
              <CommentDeleteButton
                onClick={() => props.onDelete(article.slug, comment.id)}
                data-cy="comment-delete-button"
              >
                <AiFillDelete />
              </CommentDeleteButton>
            )}
          </CommentInfo>
        </CommentContainer>
      ))}
    </Container>
  );
};

export default ArticleCommentTemplate;

const Container = styled.div`
  ${tw`w-10/12 mx-auto sm:w-11/12`}
`;

const FormContainer = styled.div`
  ${tw`w-full`}
`;

const FormInfo = styled.div`
  ${tw`w-full flex items-center px-5 py-3 bg-gray-100 border border-t-0 border-gray-300 rounded-b-md`}
`;

const AuthorContainer = styled.div`
  ${tw`flex items-center gap-1`}
`;

const AuthorName = styled.div`
  ${tw`text-xs text-primary hover:text-secondary hover:underline`}
`;

const AuthorDate = styled.div`
  ${tw`text-xs text-gray-400`}
`;

const CommentContainer = styled.div`
  ${tw`w-full border border-gray-300 rounded-md mt-3`}
`;

const CommentBody = styled.div`
  ${tw`w-full p-5`}
`;

const CommentInfo = styled.div`
  ${tw`w-full bg-gray-100 border-t border-gray-300 flex items-center px-5 py-3`}
`;

const CommentDeleteButton = styled.div`
  ${tw`w-4 h-4 text-xs text-gray-400 ml-auto cursor-pointer`}
`;
