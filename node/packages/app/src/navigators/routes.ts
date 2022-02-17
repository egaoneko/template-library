import { ComponentType } from 'react';

import HomePageContainer from 'src/components/pages/main/HomePageContainer.tsx';
import SplashPageContainer from 'src/components/pages/common/SplashPageContainer';
import FeedPageContainer from 'src/components/pages/main/article/FeedPageContainer.tsx';
import PostArticlePageContainer from 'src/components/pages/main/editor/PostArticlePageContainer.tsx';
import MainPageContainer from 'src/components/pages/common/MainPageContainer';
import SignInPageContainer from 'src/components/pages/common/SignInPageContainer';
import SignUpPageContainer from 'src/components/pages/common/SignUpPageContainer';
import { MAIN_NAVIGATION_TYPE } from 'src/enums/main-navigation';
import { COMMON_NAVIGATION_TYPE } from 'src/enums/common-navigation';
import { MY_NAVIGATION_TYPE } from 'src/enums/my-navigation';
import MyPageContainer from 'src/components/pages/main/MyPageContainer';
import MySettingsPageContainer from 'src/components/pages/my/MySettingsPageContainer.tsx';
import MyArticlesPageContainer from 'src/components/pages/my/MyArticlesPageContainer.tsx';
import MyFavoritedArticlesPageContainer from 'src/components/pages/my/MyFavoritedArticlesPageContainer.tsx';
import { ARTICLE_NAVIGATION_TYPE } from 'src/enums/article-navigation';
import ArticlePageContainer from 'src/components/pages/article/ArticlePageContainer';
import AuthorPageContainer from 'src/components/pages/article/AuthorPageContainer';
import TagsPageContainer from 'src/components/pages/article/TagsPageContainer';
import EditPageContainer from 'src/components/pages/article/EditPageContainer';

interface RoutesInfo {
  name: COMMON_NAVIGATION_TYPE | MAIN_NAVIGATION_TYPE | MY_NAVIGATION_TYPE | ARTICLE_NAVIGATION_TYPE;
  component: ComponentType<unknown>;
  options?: { headerShown?: boolean };
  initialParams?: {
    auth?: boolean;
  };
}

const commonRoutes: RoutesInfo[] = [
  {
    name: COMMON_NAVIGATION_TYPE.SPLASH,
    component: SplashPageContainer,
  },
  {
    name: COMMON_NAVIGATION_TYPE.MAIN,
    component: MainPageContainer,
  },
  {
    name: COMMON_NAVIGATION_TYPE.SIGN_IN,
    component: SignInPageContainer,
  },
  {
    name: COMMON_NAVIGATION_TYPE.SIGN_UP,
    component: SignUpPageContainer,
  },
];

const mainRoutes: RoutesInfo[] = [
  {
    name: MAIN_NAVIGATION_TYPE.HOME,
    component: HomePageContainer,
    initialParams: {
      auth: true,
    },
  },
  {
    name: MAIN_NAVIGATION_TYPE.FEED,
    component: FeedPageContainer,
    initialParams: {
      auth: true,
    },
  },
  {
    name: MAIN_NAVIGATION_TYPE.POST_ARTICLE,
    component: PostArticlePageContainer,
    initialParams: {
      auth: true,
    },
  },
  {
    name: MAIN_NAVIGATION_TYPE.MY,
    component: MyPageContainer,
    initialParams: {
      auth: true,
    },
  },
];

const myRoutes: RoutesInfo[] = [
  {
    name: MY_NAVIGATION_TYPE.MY_SETTINGS,
    component: MySettingsPageContainer,
    initialParams: {
      auth: true,
    },
  },
  {
    name: MY_NAVIGATION_TYPE.MY_ARTICLES,
    component: MyArticlesPageContainer,
    initialParams: {
      auth: true,
    },
  },
  {
    name: MY_NAVIGATION_TYPE.MY_FAVORITED_ARTICLES,
    component: MyFavoritedArticlesPageContainer,
    initialParams: {
      auth: true,
    },
  },
];

const articleRoutes: RoutesInfo[] = [
  {
    name: ARTICLE_NAVIGATION_TYPE.ARTICLE,
    component: ArticlePageContainer,
    initialParams: {
      auth: true,
    },
  },
  {
    name: ARTICLE_NAVIGATION_TYPE.AUTHOR,
    component: AuthorPageContainer,
    initialParams: {
      auth: true,
    },
  },
  {
    name: ARTICLE_NAVIGATION_TYPE.TAGS,
    component: TagsPageContainer,
    initialParams: {
      auth: true,
    },
  },
  {
    name: ARTICLE_NAVIGATION_TYPE.EDIT,
    component: EditPageContainer,
    initialParams: {
      auth: true,
    },
  },
];

export { commonRoutes, mainRoutes, myRoutes, articleRoutes };
