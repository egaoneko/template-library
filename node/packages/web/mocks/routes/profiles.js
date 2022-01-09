// Use this file only as a guide for first steps. Delete it when you have added your own routes files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

const profiles = require('../data/profiles');

module.exports = [
  {
    id: 'get-profiles',
    url: '/api/profiles/:username',
    method: 'GET',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { username } = req.params;
          const profile = profiles.find(profile => profile.username === username);

          if (!profile) {
            res.status(404);
            res.end();
            return;
          }

          res.status(200);
          res.send(profile);
        },
      },
    ],
  },
  {
    id: 'post-profiles-follow',
    url: '/api/profiles/:username/follow',
    method: 'POST',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { username } = req.params;
          const profile = profiles.find(profile => profile.username === username);

          if (!profile) {
            res.status(404);
            res.end();
            return;
          }

          res.status(200);
          res.send({
            ...profile,
            following: true,
          });
        },
      },
    ],
  },
  {
    id: 'delete-profiles-follow',
    url: '/api/profiles/:username/follow',
    method: 'DELETE',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { username } = req.params;
          const profile = profiles.find(profile => profile.username === username);

          if (!profile) {
            res.status(404);
            res.end();
            return;
          }

          res.status(200);
          res.send({
            ...profile,
            following: false,
          });
        },
      },
    ],
  },
];
