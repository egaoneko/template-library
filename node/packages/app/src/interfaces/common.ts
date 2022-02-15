import { COMMON_NAVIGATION_TYPE } from 'src/enums/common-navigation';
import { MAIN_NAVIGATION_TYPE } from 'src/enums/main-navigation';
import { MY_NAVIGATION_TYPE } from 'src/enums/my-navigation';
import { ARTICLE_NAVIGATION_TYPE } from 'src/enums/article-navigation';

export type CommonParamList = {
  [COMMON_NAVIGATION_TYPE.SPLASH]: undefined;
  [COMMON_NAVIGATION_TYPE.MAIN]: undefined;
  [COMMON_NAVIGATION_TYPE.SIGN_IN]: undefined;
  [COMMON_NAVIGATION_TYPE.SIGN_UP]: undefined;
};

export type MainParamList = {
  [MAIN_NAVIGATION_TYPE.HOME]: undefined;
  [MAIN_NAVIGATION_TYPE.FEED]: undefined;
  [MAIN_NAVIGATION_TYPE.POST_ARTICLE]: undefined;
  [MAIN_NAVIGATION_TYPE.MY]: undefined;
};

export type MyParamList = {
  [MY_NAVIGATION_TYPE.MY_SETTINGS]: undefined;
  [MY_NAVIGATION_TYPE.MY_ARTICLES]: undefined;
  [MY_NAVIGATION_TYPE.MY_FAVORITED_ARTICLES]: undefined;
};

export type ArticleParamList = {
  [ARTICLE_NAVIGATION_TYPE.ARTICLE]: {
    slug: string;
  };
  [ARTICLE_NAVIGATION_TYPE.AUTHOR]: {
    username: string;
  };
  [ARTICLE_NAVIGATION_TYPE.TAGS]: undefined;
};
