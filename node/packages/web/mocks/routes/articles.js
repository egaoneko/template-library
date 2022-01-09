// Use this file only as a guide for first steps. Delete it when you have added your own routes files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

const articles = require('../data/articles');
const comments = require('../data/comments');
const feed = require('../data/feed');

module.exports = [
  {
    id: 'get-articles-tags',
    url: '/api/articles/tags',
    method: 'GET',
    variants: [
      {
        id: 'success',
        response: {
          status: 200,
          body: articles.reduce((tags, article) => {
            const newTags = [...tags];

            article.tagList.forEach(tag => {
              if (tags.indexOf(tag) > -1) {
                return;
              }
              newTags.push(tag);
            });

            return newTags;
          }, []),
        },
      },
    ],
  },
  {
    id: 'get-articles',
    url: '/api/articles',
    method: 'GET',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { page = 1, limit = 20, tag, author, favorited } = req.query;
          let list = articles;

          list = list.filter(article => {
            let valid = true;

            if (tag) {
              valid = article.tagList.indexOf(tag) > -1;
            }

            if (author) {
              valid = article.author.username === author;
            }

            if (favorited) {
              valid = article.author.username === favorited;
            }

            return valid;
          });

          res.status(200);
          res.send({
            count: list.length,
            list: list.slice((page - 1) * limit, page * limit),
          });
        },
      },
    ],
  },
  {
    id: 'get-articles-feed',
    url: '/api/articles/feed',
    method: 'GET',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { page = 1, limit = 20, tag } = req.query;
          res.status(200);
          res.send({
            count: feed.length,
            list: feed.slice((page - 1) * limit, page * limit),
          });
        },
      },
    ],
  },
  {
    id: 'post-articles',
    url: '/api/articles',
    method: 'POST',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          res.status(200);
          res.send({
            ...articles[0],
            ...req.body,
          });
        },
      },
    ],
  },
  {
    id: 'get-article',
    url: '/api/articles/:slug',
    method: 'GET',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { slug } = req.params;
          const article = articles.find(article => article.slug === slug);

          if (!article) {
            res.status(404);
            res.end();
            return;
          }

          res.status(200);
          res.send(article);
        },
      },
    ],
  },
  {
    id: 'put-article',
    url: '/api/articles/:slug',
    method: 'PUT',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { slug } = req.params;
          const article = articles.find(article => article.slug === slug);

          if (!article) {
            res.status(404);
            res.end();
            return;
          }

          res.status(200);
          res.send({
            ...article,
            ...req.body,
          });
        },
      },
    ],
  },
  {
    id: 'delete-article',
    url: '/api/articles/:slug',
    method: 'DELETE',
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
    id: 'get-articles-comments',
    url: '/api/articles/:slug/comments',
    method: 'GET',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { page = 1, limit = 20 } = req.query;
          res.status(200);
          res.send({
            count: comments.length,
            list: comments.slice((page - 1) * limit, page * limit),
          });
        },
      },
    ],
  },
  {
    id: 'post-articles-comments',
    url: '/api/articles/:slug/comments',
    method: 'POST',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          res.status(200);
          res.send({
            ...comments[0],
            ...req.body,
          });
        },
      },
    ],
  },
  {
    id: 'delete-articles-comment',
    url: '/api/articles/:slug/comments/:id',
    method: 'DELETE',
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
    id: 'post-articles-favorite',
    url: '/api/articles/:slug/favorite',
    method: 'POST',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { slug } = req.params;
          const article = articles.find(article => article.slug === slug);

          if (!article) {
            res.status(404);
            res.end();
            return;
          }

          res.status(200);
          res.send({
            ...article,
            favorited: true,
            favoritesCount: article.favoritesCount + 1,
          });
        },
      },
    ],
  },
  {
    id: 'delete-articles-favorite',
    url: '/api/articles/:slug/favorite',
    method: 'DELETE',
    variants: [
      {
        id: 'success',
        response: (req, res) => {
          const { slug } = req.params;
          const article = articles.find(article => article.slug === slug);

          if (!article) {
            res.status(404);
            res.end();
            return;
          }

          res.status(200);
          res.send({
            ...article,
            favorited: false,
            favoritesCount: article.favoritesCount - 1,
          });
        },
      },
    ],
  },
];
