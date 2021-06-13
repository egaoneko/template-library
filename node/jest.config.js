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
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', '/__mocks__/'],
  collectCoverageFrom: [
    '**/*.(t|j)s'
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  maxWorkers: 1,
  globals: {
    'ts-jest': {
      diagnostics: true,
      isolatedModules: true,
    },
  },
}; 
  