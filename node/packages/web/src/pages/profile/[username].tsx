import { GetServerSidePropsResult, NextPageContext } from 'next';
import React, { ReactNode } from 'react';
import { ListResult } from '@my-app/core/lib/interfaces/common';
import { IArticle } from '@my-app/core/lib/interfaces/article';
import { IProfile } from '@my-app/core/lib/interfaces/profile';

import ProfilePageContainer from 'src/components/pages/profile/ProfilePageContainer';
import { ARTICLE_PAGE_LIMIT, EMPTY_LIST } from 'src/constants/page';
import ArticleAPI from 'src/api/article';
import Context from 'src/libs/Context';
import ProfileAPI from 'src/api/profile';

interface PropsType {
  username: string;
  profile: IProfile;
  articleList: ListResult<IArticle>;
}

function Index(props: PropsType): ReactNode {
  return <ProfilePageContainer {...props} />;
}

export default Index;

export async function getServerSideProps(ctx: NextPageContext): Promise<GetServerSidePropsResult<PropsType>> {
  const username = (ctx.query.username as string) ?? null;
  const context = new Context({
    nextContext: ctx,
  });

  let profile: IProfile;

  try {
    profile = await ProfileAPI.get(context, username);
  } catch (e) {}

  if (!profile) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const props: PropsType = {
    username,
    profile,
    articleList: EMPTY_LIST,
  };

  try {
    props.articleList = await ArticleAPI.getList(context, { page: 1, limit: ARTICLE_PAGE_LIMIT, author: username });
  } catch (e) {}

  return {
    props,
  };
}
