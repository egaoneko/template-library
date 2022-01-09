// Use this file only as a guide for first steps. Delete it when you have added your own routes files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

module.exports = [
  {
    id: 'get-file',
    url: '/api/file/:fileId',
    method: 'GET',
    variants: [
      {
        id: 'success',
        response: {
          status: 200,
        },
      },
    ],
  },
  {
    id: 'post-file',
    url: '/api/file/upload',
    method: 'POST',
    variants: [
      {
        id: 'success',
        response: {
          status: 200,
          body: {
            id: 1,
          },
        },
      },
    ],
  },
];
