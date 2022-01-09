module.exports = {
  root: true,
  plugins: ['import'],
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-shadow': 'off',
    'no-void': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'prettier/prettier': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'unknown',
          'parent',
          'index',
          'sibling',
          'object',
        ],
        'newlines-between': 'always',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    "import/ignore": [
      "node_modules/react-native/index\\.js$"
    ],
    'import/internal-module-folders': ['@my-app/'],
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', './', 'src/'],
      },
    },
  },
};
