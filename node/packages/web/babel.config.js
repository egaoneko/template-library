module.exports = {
  env: {
    production: {
      plugins: [
        [
          'react-remove-properties',
          {
            properties: ['data-cy'],
          },
        ],
      ],
    },
  },
  presets: [['next/babel', {'preset-react': {runtime: 'automatic'}}]],
  plugins: [
    'babel-plugin-macros',
    ['styled-components', {ssr: true}],
  ],
};
