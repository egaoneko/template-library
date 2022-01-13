const OpenBrowserPlugin = require('./plugins/open-browser-plugin');

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'static.productionready.io', 'i.stack.imgur.com'],
  },
  reactStrictMode: true,
  api: {
    externalResolver: true,
  },
  webpack(config, { dev }) {
    if (dev) {
      config.plugins.push(new OpenBrowserPlugin());
    }

    if (!dev) {
      config.devtool = 'hidden-source-map';
    }

    return config;
  },
};
