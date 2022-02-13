import { StorageName } from 'src/enums/storage';

export const StorageNameExpires: { [key in StorageName]: number } = {
  [StorageName.ACCESS_TOKEN]: 180000, // 1000*60*3
  [StorageName.REFRESH_TOKEN]: 604800000, // 1000*60*60*24*7
  [StorageName.USER_INFO]: 604800000, // 1000*60*60*24*7
};
