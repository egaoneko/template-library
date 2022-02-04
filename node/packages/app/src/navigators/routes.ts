import { ComponentType } from 'react';

import HomePageContainer from 'src/components/pages/main/HomePageContainer.tsx';
import SplashPageContainer from 'src/components/pages/common/SplashPageContainer';
import FeedPageContainer from 'src/components/pages/main/article/FeedPageContainer.tsx';
import PostArticlePageContainer from 'src/components/pages/main/editor/PostArticlePageContainer.tsx';
import SettingsPageContainer from 'src/components/pages/main/user/SettingsPageContainer.tsx';
import MainPageContainer from 'src/components/pages/common/MainPageContainer';
import SignInPageContainer from 'src/components/pages/common/SignInPageContainer';
import SignUpPageContainer from 'src/components/pages/common/SignUpPageContainer';
import { MAIN_NAVIGATION_TYPE } from 'src/enums/main-navigation';
import { COMMON_NAVIGATION_TYPE } from 'src/enums/common-navigation';

interface RoutesInfo {
  name: COMMON_NAVIGATION_TYPE | MAIN_NAVIGATION_TYPE;
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
  { name: MAIN_NAVIGATION_TYPE.HOME, component: HomePageContainer },
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

export { commonRoutes, mainRoutes };
