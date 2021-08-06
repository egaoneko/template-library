module.exports = {
  presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }]],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'babel-plugin-macros',
    ['styled-components', { ssr: true }],
  ],
};
