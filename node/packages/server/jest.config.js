const { cloneDeep } = require('lodash');
const jestConfig = require('../../jest.config');
const overwrittenConfig = cloneDeep(jestConfig);
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

overwrittenConfig.rootDir = '';
overwrittenConfig.roots = [
  '<rootDir>',
];
overwrittenConfig.modulePaths = [
  '<rootDir>',
];
overwrittenConfig.moduleDirectories = [
  'node_modules',
];
overwrittenConfig.moduleNameMapper = {
  ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};

module.exports = overwrittenConfig;
