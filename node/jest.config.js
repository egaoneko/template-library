module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  rootDir: '__tests__',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  testEnvironment: 'node',
  maxWorkers: 1,
  globals: {
    'ts-jest': {
      diagnostics: true,
      isolatedModules: true,
    },
  },
};
