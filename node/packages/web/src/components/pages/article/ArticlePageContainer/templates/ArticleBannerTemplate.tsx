import Avatar from '@components/atoms/avatar/Avatar';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { IUser } from '@my-app/core/lib/interfaces/user';
import format from 'date-fns/format';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { AiFillEdit, AiFillDelete, AiOutlinePlus, AiOutlineMinus, AiFillHeart } from 'react-icons/ai';
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

const ArticleBannerTemplate: FC<PropsType> = props => {
  const router = useRouter();
  const article = props.articleResult.data;
  const self = article?.author.username === props.user?.username;

  return (
    <Container>
      {article && (
        <>
          <Title data-cy="article-title">{article.title}</Title>
          <AuthorContainer>
            <Avatar size="middle" url={article.author.image} data-cy="article-banner-author-image" />
            <AuthorInfo>
              <AuthorName data-cy="article-banner-author-username">
                <Link href={`/profile/${article.author.username}`}>{article.author.username}</Link>
              </AuthorName>
              <AuthorDate data-cy="article-banner-author-date">
                {format(new Date(article.updatedAt), 'EEE MMM d yyyy')}
              </AuthorDate>
            </AuthorInfo>
            {self ? (
              <>
                <Edit onClick={() => router.push(`/editor/edit/${article.slug}`)} data-cy="article-banner-edit-article">
                  <div className="w-4 h-4">
                    <AiFillEdit />
                  </div>
                  <div>Edit article</div>
                </Edit>
                <Delete onClick={() => props.onDelete(article.slug)} data-cy="article-banner-delete-article">
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
                  data-cy="article-banner-follow"
                >
                  <div className="w-4 h-4">{article.author.following ? <AiOutlineMinus /> : <AiOutlinePlus />}</div>
                  <div>{article.author.following ? 'Unfollow' : 'Follow'}</div>
                </Follow>
                <Favorite
                  favorited={article.favorited}
                  onClick={() => props.toggleFavorite(article.slug, !article.favorited)}
                  data-cy="article-banner-favorite"
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
        </>
      )}
    </Container>
  );
};

export default ArticleBannerTemplate;

const Container = styled.div`
  ${tw`max-w-full select-none px-16 py-8`}
  background-color: #333;
`;

const Title = styled.h1`
  ${tw`font-semibold text-5xl text-white font-sans pb-2`}
`;

const AuthorContainer = styled.div`
  ${tw`w-full flex items-center mt-6`}
`;

const AuthorInfo = styled.div`
  ${tw`w-auto ml-1.5 mr-6`}
`;

const AuthorName = styled.div`
  ${tw`text-white hover:underline`}
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
