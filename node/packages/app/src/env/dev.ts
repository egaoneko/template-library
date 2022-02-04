import { Environment, EnvType } from './types';

const ENV_DEV: Environment = {
  NAME: EnvType.DEV,
  API_SERVER_URL: `http://127.0.0.1:8080`,
};

export default ENV_DEV;
