module.exports = {
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-empty-interface': 'off',
  },
};
