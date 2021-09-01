import {ComponentType} from 'react';
import {NAVIGATION_TYPE} from '../enums/navigation';
import HomePageContainer from '../components/pages/main/HomePageContainer.tsx';
import SplashPageContainer from '../components/pages/common/SplashPageContainer';
import FeedPageContainer from '../components/pages/main/article/FeedPageContainer.tsx';
import PostArticlePageContainer from '../components/pages/main/editor/PostArticlePageContainer.tsx';
import SettingsPageContainer from '../components/pages/main/user/SettingsPageContainer.tsx';
import MainPageContainer from '../components/pages/common/MainPageContainer';

interface RoutesInfo {
  name: NAVIGATION_TYPE;
  component: ComponentType<any>;
  options?: {headerShown?: boolean};
}

const commonRoutes: RoutesInfo[] = [
  {
    name: NAVIGATION_TYPE.SPLASH,
    component: SplashPageContainer,
  },
  {
    name: NAVIGATION_TYPE.MAIN,
    component: MainPageContainer,
  },
];

const mainRoutes: RoutesInfo[] = [
  {name: NAVIGATION_TYPE.HOME, component: HomePageContainer},
  {name: NAVIGATION_TYPE.FEED, component: FeedPageContainer},
  {name: NAVIGATION_TYPE.POST_ARTICLE, component: PostArticlePageContainer},
  {name: NAVIGATION_TYPE.SETTINGS, component: SettingsPageContainer},
];

export {commonRoutes, mainRoutes};
