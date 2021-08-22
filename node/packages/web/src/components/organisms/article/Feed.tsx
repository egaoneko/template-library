import Avatar from '@components/atoms/avatar/Avatar';
import { IArticle } from '@interfaces/article';
import Link from 'next/link';
import React, { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import format from 'date-fns/format';
import { AiFillHeart } from 'react-icons/ai';
import { useRouter } from 'next/router';

interface PropsType {
  article: IArticle;
  toggleFavorite: (slag: string, toggle: boolean) => Promise<unknown>;
}

const Feed: FC<PropsType> = props => {
  const router = useRouter();
  return (
    <Container>
      <AuthorContainer>
        <Avatar size="middle" url={props.article.author.image} />
        <AuthorInfo>
          <AuthorName>
            <Link href={`/profile/${props.article.author.username}`}>{props.article.author.username}</Link>
          </AuthorName>
          <AuthorDate>{format(new Date(props.article.updatedAt), 'EEE MMM d yyyy')}</AuthorDate>
        </AuthorInfo>
        <Favorite
          favorited={props.article.favorited}
          onClick={() => props.toggleFavorite(props.article.slug, !props.article.favorited)}
        >
          <div className="w-4 h-4">
            <AiFillHeart />
          </div>
          <div>{props.article.favoritesCount}</div>
        </Favorite>
      </AuthorContainer>
      <Content onClick={() => router.push(`/article/${props.article.slug}`)}>
        <Title>{props.article.title}</Title>
        <Body>
          <p>{props.article.description}</p>
        </Body>
        <Footer>
          <ReadMore>Read more...</ReadMore>
          {props.article.tagList.length > 0 && (
            <Tags>
              {props.article.tagList.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>
          )}
        </Footer>
      </Content>
    </Container>
  );
};

export default Feed;

const Container = styled.div`
  ${tw`w-full py-6`}

  :not(:last-child) {
    ${tw`border-b border-gray-200`}
  }
`;

const AuthorContainer = styled.div`
  ${tw`w-full flex items-center mb-4`}
`;

const AuthorInfo = styled.div`
  ${tw`w-auto ml-1.5 mr-4 `}
`;

const AuthorName = styled.div`
  ${tw`text-primary hover:text-secondary hover:underline`}
`;

const AuthorDate = styled.div`
  ${tw`text-xs text-gray-400`}
`;

const Favorite = styled.div<{ favorited: boolean }>`
  ${tw`ml-auto flex justify-center items-center cursor-pointer w-10 h-7 border border-primary rounded text-sm`}
  ${({ favorited }) =>
    favorited
      ? tw`text-white bg-primary hover:text-primary hover:bg-white`
      : tw`text-primary hover:text-white hover:bg-primary`}
`;

const Content = styled.div`
  ${tw`w-full cursor-pointer`}
`;

const Title = styled.h1`
  ${tw`text-2xl font-semibold mb-1`}
`;

const Body = styled.div`
  ${tw`text-base text-gray-500 mb-4`}
`;

const Footer = styled.div`
  ${tw`w-full flex`}
`;

const ReadMore = styled.div`
  ${tw`text-xs text-gray-400`}
`;

const Tags = styled.div`
  ${tw`ml-auto align-top flex`}
  max-width: 50%;
`;

const Tag = styled.div`
  ${tw`text-xs text-gray-400 font-light leading-none whitespace-nowrap border border-gray-400 rounded-full inline-flex justify-center items-center cursor-pointer`}
  padding: 4px 10px;
  margin-right: 3px;
`;
