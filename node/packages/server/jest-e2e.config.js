const {cloneDeep} = require('lodash');
const jestConfig = require( '../../jest-e2e.config');
const {pathsToModuleNameMapper} = require('ts-jest/utils');
const {compilerOptions} = require('./tsconfig');
const overwrittenConfig = cloneDeep(jestConfig);

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
