const {pathsToModuleNameMapper} = require('ts-jest/utils');
const {compilerOptions} = require('./tsconfig');
const esModules = ['marked', 'isomorphic-dompurify'].join('|');

module.exports = {
  testEnvironment: '<rootDir>/jest.test-env.js',
  testRegex: '/__tests__/.*.jsx?$',
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`, '^.+\\.module\\.(css|sass|scss)$'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/fileMock.js`,

    // path alias
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next',
    '<rootDir>/coverage',
    '<rootDir>/node_modules',
    '<rootDir>/public',
    '<rootDir>/babel.config.js',
    '<rootDir>/next.config.js',
    '<rootDir>/cypress/'
  ],
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
