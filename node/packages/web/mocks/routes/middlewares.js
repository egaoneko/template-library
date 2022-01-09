// Use this file only as a guide for first steps using middlewares. Delete it when no more needed.
// For a detailed explanation about using middlewares, visit:
// https://mocks-server.org/docs/guides-using-middlewares

module.exports = [
  {
    id: 'authorization',
    url: '*',
    method: 'GET',
    variants: [
      {
        id: 'enabled',
        response: (req, res, next, mocksServer) => {
          const matches = req.headers.authorization?.match(/Bearer\s(.*)/);

          if (matches) {
            req.authorization = matches[1];
            mocksServer.tracer.info(`authorized: ${req.authorization}`);
          }
          next();
        },
      },
      {
        id: 'disabled',
        response: (req, res, next) => next(),
      },
    ],
  },
];
