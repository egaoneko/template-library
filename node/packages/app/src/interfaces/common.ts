import { COMMON_NAVIGATION_TYPE } from 'src/enums/common-navigation';
import { MAIN_NAVIGATION_TYPE } from 'src/enums/main-navigation';

export type CommonParamList = {
  [COMMON_NAVIGATION_TYPE.SPLASH]: undefined;
  [COMMON_NAVIGATION_TYPE.MAIN]: undefined;
  [COMMON_NAVIGATION_TYPE.LOGIN]: undefined;
};

export type MainParamList = {
  [MAIN_NAVIGATION_TYPE.HOME]: undefined;
  [MAIN_NAVIGATION_TYPE.FEED]: undefined;
  [MAIN_NAVIGATION_TYPE.POST_ARTICLE]: undefined;
  [MAIN_NAVIGATION_TYPE.SETTINGS]: undefined;
};
