import { ReactNode } from 'react';
import { GetServerSidePropsResult, NextPageContext } from 'next';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { IArticle } from '@my-app/core/lib/interfaces/article';

import HomePageContainer from 'src/components/pages/HomePageContainer';
import Context from 'src/libs/Context';
import ArticleAPI from 'src/api/article';
import { ARTICLE_PAGE_LIMIT } from 'src/constants/page';

interface PropsType {
  articleList?: ListResult<IArticle>;
  tags?: string[];
}

function Index(props: PropsType): ReactNode {
  return <HomePageContainer {...props} />;
}

export default Index;

export async function getServerSideProps(ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> {
  const context = new Context({
    nextContext: ctx,
  });

  const props: PropsType = {};
  try {
    props.articleList = await ArticleAPI.getList(context, { page: 1, limit: ARTICLE_PAGE_LIMIT });
  } catch (e) {}

  try {
    props.tags = await ArticleAPI.getTags(context);
  } catch (e) {}

  return {
    props,
  };
}
