export const MY_NAVIGATION_TYPE = {
  MY_SETTINGS: 'MY_SETTINGS',
  MY_ARTICLES: 'MY_ARTICLES',
  MY_FAVORITED_ARTICLES: 'MY_FAVORITED_ARTICLES',
} as const;

export type MY_NAVIGATION_TYPE = typeof MY_NAVIGATION_TYPE[keyof typeof MY_NAVIGATION_TYPE];
