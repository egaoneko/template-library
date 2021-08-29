/* eslint-disable @typescript-eslint/no-explicit-any */
import Avatar from '@components/atoms/avatar/Avatar';
import format from 'date-fns/format';
import { IArticle } from '@interfaces/article';
import { IUser } from '@interfaces/user';
import { AiFillEdit, AiFillDelete, AiOutlinePlus, AiOutlineMinus, AiFillHeart } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React, { FC } from 'react';
import { UseQueryResult } from 'react-query';
import styled from 'styled-components';
import tw from 'twin.macro';

interface PropsType {
  user: IUser | null;
  articleResult: UseQueryResult<IArticle>;
  toggleFollow: (username: string, toggle: boolean) => Promise<unknown>;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
  onDelete: (slag: string) => Promise<unknown>;
}

const ArticleContentTemplate: FC<PropsType> = props => {
  const router = useRouter();
  const article = props.articleResult.data;
  const self = article?.author.username === props.user?.username;

  if (!article) {
    return null;
  }

  return (
    <Container>
      <Content>
        <Body data-cy="article-content-body">
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </Body>
        {article.tagList.length > 0 && (
          <Tags>
            {article.tagList.map(tag => (
              <Tag data-cy="article-content-tags" key={tag}>
                {tag}
              </Tag>
            ))}
          </Tags>
        )}
        <hr />
      </Content>

      <AuthorWrapper>
        <AuthorContainer>
          <Avatar size="middle" url={article.author.image} data-cy="article-content-author-image" />
          <AuthorInfo>
            <AuthorName data-cy="article-content-author-username">
              <Link href={`/profile/${article.author.username}`}>{article.author.username}</Link>
            </AuthorName>
            <AuthorDate data-cy="article-content-author-date">
              {format(new Date(article.updatedAt), 'EEE MMM d yyyy')}
            </AuthorDate>
          </AuthorInfo>
          {self ? (
            <>
              <Edit onClick={() => router.push(`/editor/${article.slug}`)} data-cy="article-content-edit-article">
                <div className="w-4 h-4">
                  <AiFillEdit />
                </div>
                <div>Edit article</div>
              </Edit>
              <Delete onClick={() => props.onDelete(article.slug)} data-cy="article-content-delete-article">
                <div className="w-4 h-4">
                  <AiFillDelete />
                </div>
                <div>Delete Article</div>
              </Delete>
            </>
          ) : (
            <>
              <Follow
                following={article.author.following}
                onClick={() => props.toggleFollow(article.author.username, !article.author.following)}
                data-cy="article-content-follow"
              >
                <div className="w-4 h-4">{article.author.following ? <AiOutlineMinus /> : <AiOutlinePlus />}</div>
                <div>{article.author.following ? 'Unfollow' : 'Follow'}</div>
              </Follow>
              <Favorite
                favorited={article.favorited}
                onClick={() => props.toggleFavorite(article.slug, !article.favorited)}
                data-cy="article-content-favorite"
              >
                <div className="w-4 h-4">
                  <AiFillHeart />
                </div>
                <div>
                  {article.favorited ? 'Unfavorite' : 'Favorite'} ({article.favoritesCount})
                </div>
              </Favorite>
            </>
          )}
        </AuthorContainer>
      </AuthorWrapper>
    </Container>
  );
};

export default ArticleContentTemplate;

const Container = styled.div`
  ${tw`container mx-auto`}
`;

const Content = styled.div`
  ${tw`w-full`}
`;

const Body = styled.div`
  ${tw`w-full mb-8`}
`;

const Tags = styled.div`
  ${tw`mb-4 align-top flex`}
  max-width: 50%;
`;

const Tag = styled.div`
  ${tw`text-xs text-gray-400 font-light leading-none whitespace-nowrap border border-gray-400 rounded-full inline-flex justify-center items-center`}
  padding: 4px 10px;
  margin-right: 3px;
`;

const AuthorWrapper = styled.div`
  ${tw`w-full mt-6 mb-12 text-center`}
`;

const AuthorContainer = styled.div`
  ${tw`inline-flex items-center`}
`;

const AuthorInfo = styled.div`
  ${tw`w-auto ml-1.5 mr-6`}
`;

const AuthorName = styled.div`
  ${tw`text-primary hover:text-secondary hover:underline`}
`;

const AuthorDate = styled.div`
  ${tw`text-xs text-gray-400`}
`;

const Edit = styled.div`
  ${tw`flex justify-center items-center cursor-pointer w-24 h-7 border border-gray-400 rounded text-sm text-gray-400 hover:text-white hover:bg-gray-400`}
`;

const Delete = styled.div`
  ${tw`flex justify-center items-center cursor-pointer w-28 h-7 border border-red-700 rounded text-sm ml-1 text-red-700 hover:text-white hover:bg-red-700`}
`;

const Follow = styled.div<{ following: boolean }>`
  ${tw`flex justify-center items-center cursor-pointer w-20 h-7 border border-gray-400 rounded text-sm`}
  ${({ following }) =>
    following ? tw`text-white bg-gray-500 hover:bg-gray-400` : tw`text-gray-400 hover:text-white hover:bg-gray-400`}
`;

const Favorite = styled.div<{ favorited: boolean }>`
  ${tw`flex justify-center items-center cursor-pointer w-28 h-7 border border-primary rounded text-sm ml-1`}
  ${({ favorited }) =>
    favorited
      ? tw`text-white bg-secondary hover:border-primary hover:bg-primary`
      : tw`text-primary hover:text-white hover:bg-primary`}
`;

const ReactMarkdown = dynamic(() => import('react-markdown') as any, { ssr: false });
