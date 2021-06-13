const {cloneDeep} = require('lodash');
const jestConfig = require( '../../jest-e2e.config');
const overwrittenConfig = cloneDeep(jestConfig);
overwrittenConfig.moduleNameMapper = {
  '^@root/(.*)$': '<rootDir>/../src/$1',
  '^@common/(.*)$': '<rootDir>/../src/common/$1',
  '^@config/(.*)$': '<rootDir>/../src/config/$1',
  '^@auth/(.*)$': '<rootDir>/../src/auth/$1',
  '^@user/(.*)$': '<rootDir>/../src/user/$1',
};
module.exports = overwrittenConfig;
