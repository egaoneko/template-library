import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';
import { loadEnvConfig } from '@next/env';

export default async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
}
