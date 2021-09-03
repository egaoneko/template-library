import {NAVIGATION_TYPE} from '../enums/navigation';

export type CommonParamList = {
  [NAVIGATION_TYPE.SPLASH]: undefined;
  [NAVIGATION_TYPE.MAIN]: undefined;
};

export type MainParamList = {
  [NAVIGATION_TYPE.HOME]: undefined;
  [NAVIGATION_TYPE.FEED]: undefined;
  [NAVIGATION_TYPE.POST_ARTICLE]: undefined;
  [NAVIGATION_TYPE.SETTINGS]: undefined;
};
