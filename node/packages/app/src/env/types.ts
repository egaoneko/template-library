export enum EnvType {
  DEV = 'dev',
}

export interface Environment {
  NAME: EnvType;
  API_SERVER_URL: string;
}
