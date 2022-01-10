import { GetServerSidePropsResult, NextPageContext } from 'next';
import React, { ReactNode } from 'react';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { IComment } from '@my-app/core/lib/interfaces/comment';

import ArticlePageContainer from 'src/components/pages/article/ArticlePageContainer';
import ArticleAPI from 'src/api/article';
import { COMMENT_PAGE_LIMIT, EMPTY_LIST } from 'src/constants/page';
import Context from 'src/libs/Context';

interface PropsType {
  slug: string;
  article: IArticle;
  commentList: ListResult<IComment>;
}

function Index(props: PropsType): ReactNode {
  return <ArticlePageContainer {...props} />;
}

export default Index;

export async function getServerSideProps(ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> {
  const slug = (ctx.query.slug as string) ?? null;
  const context = new Context({
    nextContext: ctx,
  });

  let article: IArticle;

  try {
    article = await ArticleAPI.get(context, slug);
  } catch (e) {}

  if (!article) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const props: PropsType = {
    slug,
    article,
    commentList: EMPTY_LIST,
  };

  try {
    props.commentList = await ArticleAPI.getCommentList(context, slug, { limit: COMMENT_PAGE_LIMIT });
  } catch (e) {}

  return {
    props,
  };
}
