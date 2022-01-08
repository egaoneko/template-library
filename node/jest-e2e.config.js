module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  rootDir: '__tests__',
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  maxWorkers: 1,
  globals: {
    'ts-jest': {
      diagnostics: true,
      isolatedModules: true,
    },
  },
};
