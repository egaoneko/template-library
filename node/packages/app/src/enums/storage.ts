export enum StorageName {
  ACCESS_TOKEN = 'RW_AT',
  REFRESH_TOKEN = 'RW_RT',
}

export enum StorageNameExpires {
  ACCESS_TOKEN = 180000, // 1000*60*3
  REFRESH_TOKEN = 604800000, // 1000*60*60*24*7
}
