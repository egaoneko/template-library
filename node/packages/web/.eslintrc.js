const lintConfig = require('../../.eslintrc.js');
module.exports = lintConfig;

module.exports = {
  ...lintConfig,
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  extends: ['plugin:@next/next/recommended', ...lintConfig.extends],
  ignorePatterns: ['*.js'],
  rules: {
    '@typescript-eslint/no-empty-interface': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@next/next/no-server-import-in-page': 'off',
    ...lintConfig.rules,
  },
  settings: {
    ...lintConfig.settings,
    react: {
      version: 'detect',
    },
  },
};
