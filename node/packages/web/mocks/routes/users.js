// Use this file only as a guide for first steps. Delete it when you have added your own routes files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

const users = require('../data/users');

module.exports = [
  {
    id: 'get-users',
    url: '/api/users',
    method: 'GET',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const user = users.find(user => user.token === req.authorization);
          if (!user) {
            res.status(400);
            res.send({
              message: 'Unauthorized',
            });
            return;
          }
          res.status(200);
          res.send(user);
        },
      },
    ],
  },
  {
    id: 'put-users',
    url: '/api/users',
    method: 'PUT',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const user = users.find(user => user.token === req.authorization);
          if (!user) {
            res.status(400);
            res.send({
              message: 'Unauthorized',
            });
            return;
          }
          res.status(200);
          res.send({
            ...user,
            ...req.body,
          });
        },
      },
    ],
  },
];
