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
};
