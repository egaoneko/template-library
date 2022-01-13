module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    ecmaVersion: 8,
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'prettier/prettier': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'unknown', 'parent', 'index', 'sibling', 'object', 'type'],
        'newlines-between': 'always',
      },
    ],
  },
  settings: {
    'import/internal-module-folders': ['@my-app/'],
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', './', 'src/'],
      },
    },
  },
};
