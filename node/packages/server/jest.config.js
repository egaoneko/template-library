const {cloneDeep} = require('lodash');
const jestConfig = require( '../../jest.config');
const overwrittenConfig = cloneDeep(jestConfig);
overwrittenConfig.rootDir = 'src';
overwrittenConfig.moduleNameMapper = {
  '^@root/(.*)$': '<rootDir>/../src/$1',
  '^@shared/(.*)$': '<rootDir>/../src/shared/$1',
  '^@config/(.*)$': '<rootDir>/../src/config/$1',
  '^@auth/(.*)$': '<rootDir>/../src/auth/$1',
  '^@user/(.*)$': '<rootDir>/../src/user/$1',
  '^@profile/(.*)$': '<rootDir>/../src/profile/$1',
  '^@article/(.*)$': '<rootDir>/../src/article/$1',
};
module.exports = overwrittenConfig;
