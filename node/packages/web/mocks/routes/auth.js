// Use this file only as a guide for first steps. Delete it when you have added your own routes files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

const users = require('../data/users');

module.exports = [
  {
    id: 'post-auth-register',
    url: '/api/auth/register',
    method: 'POST',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const user = users.find(user => user.email === req.body.email);
          if (!user) {
            res.status(500);
            res.send({
              message: 'ERROR',
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
    id: 'post-auth-login',
    url: '/api/auth/login',
    method: 'POST',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const user = users.find(user => user.email === req.body.email);
          if (!user) {
            res.status(500);
            res.send({
              message: 'ERROR',
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
    id: 'post-auth-logout',
    url: '/api/auth/logout',
    method: 'POST',
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
    id: 'post-auth-refresh',
    url: '/api/auth/refresh',
    method: 'POST',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          if (!req.body.refreshToken) {
            res.status(400);
            res.send({
              message: 'Unauthorized',
            });
            return;
          }
          res.status(200);
          res.end();
        },
      },
    ],
  },
  {
    id: 'post-auth-validate',
    url: '/api/auth/validate',
    method: 'POST',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          if (!req.authorization) {
            res.status(400);
            res.end();
            return;
          }
          res.status(200);
          res.end();
        },
      },
    ],
  },
];
