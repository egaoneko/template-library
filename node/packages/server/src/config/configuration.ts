import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

let YAML_CONFIG_FILENAME: string;

switch (process.env.PHASE) {
  case 'dev':
    YAML_CONFIG_FILENAME = 'dev.yaml';
    break;
  case 'test':
    YAML_CONFIG_FILENAME = 'test.yaml';
    break;
  case 'prod':
  default:
    YAML_CONFIG_FILENAME = 'prod.yaml';
}

export default (): Record<string, unknown> =>
  yaml.load(readFileSync(path.join(__dirname, `../../env/${YAML_CONFIG_FILENAME}`), 'utf8')) as Record<string, unknown>;
