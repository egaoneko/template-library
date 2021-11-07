const { cloneDeep } = require('lodash');
const jestConfig = require('../../jest.config');
const overwrittenConfig = cloneDeep(jestConfig);
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

overwrittenConfig.rootDir = '';
overwrittenConfig.moduleNameMapper = {
  ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};

module.exports = overwrittenConfig;
