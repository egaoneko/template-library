module.exports = {
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
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
