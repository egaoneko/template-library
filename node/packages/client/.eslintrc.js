const {cloneDeep} = require('lodash');
const lintConfig = require('../../.eslintrc.js');
const overwrittenConfig = cloneDeep(lintConfig);

overwrittenConfig.plugins.push(
  'react'
);

overwrittenConfig.extends.push(
  'plugin:react/recommended', // React rules
  'plugin:react-hooks/recommended', // React hooks rules
);

overwrittenConfig.rules = {
  ...overwrittenConfig.rules,
  'react/react-in-jsx-scope': 'off',
  'react/display-name': ['off', {ignoreTranspilerName: false}],
};

overwrittenConfig.settings = {
  ...overwrittenConfig.settings,
  react: {
    createClass: 'createReactClass', // Regex for Component Factory to use, default to "createReactClass"
    pragma: 'React', // Pragma to use, default to "React"
    fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
    version: 'detect', // React version. "detect" automatically picks the version you have installed.
    // flowVersion: '0.53', // Flow version
  }
}

module.exports = overwrittenConfig;
