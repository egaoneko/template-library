import {ComponentType} from 'react';
import HomePageContainer from '../components/pages/main/HomePageContainer.tsx';
import SplashPageContainer from '../components/pages/common/SplashPageContainer';
import FeedPageContainer from '../components/pages/main/article/FeedPageContainer.tsx';
import PostArticlePageContainer from '../components/pages/main/editor/PostArticlePageContainer.tsx';
import SettingsPageContainer from '../components/pages/main/user/SettingsPageContainer.tsx';
import MainPageContainer from '../components/pages/common/MainPageContainer';
import LoginPageContainer from '../components/pages/common/LoginPageContainer';
import { MAIN_NAVIGATION_TYPE } from '../enums/main-navigation';
import { COMMON_NAVIGATION_TYPE } from '../enums/common-navigation';

interface RoutesInfo {
  name:  COMMON_NAVIGATION_TYPE | MAIN_NAVIGATION_TYPE;
  component: ComponentType<any>;
  options?: {headerShown?: boolean};
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
    name: COMMON_NAVIGATION_TYPE.LOGIN,
    component: LoginPageContainer,
  },
];

const mainRoutes: RoutesInfo[] = [
  {name: MAIN_NAVIGATION_TYPE.HOME, component: HomePageContainer},
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
    name: MAIN_NAVIGATION_TYPE.SETTINGS,
    component: SettingsPageContainer,
    initialParams: {
      auth: true,
    },
  },
];

export {commonRoutes, mainRoutes};
