// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload';
import { getRemote } from 'mockttp';

const mockServer = getRemote();

Cypress.Commands.add('mockServerStart', port => {
  return mockServerStart(port);
});

Cypress.Commands.add('mockServerStop', () => {
  return mockServerEnd();
});

Cypress.Commands.add('mockServerBuilder', (method, url, response, statusCode) => {
  return mockServerBuilder(method, url, response, statusCode);
});

Cypress.Commands.add('login', (fixture = 'user/user.json') => {
  cy.fixture(fixture).then(user => {
    const response = {
      statusCode: 200,
      body: user,
    };
    cy.setCookie('RW_AT', user.token);
    if (user.refreshToken) {
      cy.setCookie('RW_RT', user.refreshToken);
    }
    cy.intercept('POST', 'http://localhost:8080/api/auth/login', req => {
      req.continue(res => {
        res.send(response);
      });
    }).as('login');
    cy.intercept('GET', 'http://localhost:8080/api/users', req => {
      req.continue(res => {
        res.send(response);
      });
    }).as('getCurrentUser');

    // https://stackoverflow.com/questions/47631821/mocking-server-for-ssr-react-app-e2e-tests-with-cypress-io
    mockServerBuilder('get', '/api/users', response.body, response.statusCode);
  });
});

Cypress.Commands.add('prepareHome', (delay = 0) => {
  cy.intercept('GET', 'http://localhost:8080/api/articles?page=1&limit=5', {
    delay,
    fixture: 'article/articles-page-1.json',
  }).as('getArticles');
  cy.intercept('GET', 'http://localhost:8080/api/articles/tags', { delay, fixture: 'article/tags.json' }).as('getTags');
});

Cypress.Commands.add('prepareArticle', (delay = 0, fixture = 'article/article.json') => {
  cy.fixture(fixture).then(article => {
    cy.intercept('GET', `http://localhost:8080/api/articles/${article.slug}`, {
      delay,
      fixture,
    }).as('getArticle');
    cy.intercept('GET', `http://localhost:8080/api/articles/${article.slug}/comments?limit=999`, {
      delay,
      fixture: 'article/comments.json',
    }).as('geComments');
  });
});

Cypress.Commands.add('prepareProfile', (delay = 0, fixture = 'profile/user.json') => {
  cy.fixture(fixture).then(profile => {
    cy.intercept('GET', `http://localhost:8080/api/profiles/${profile.username}`, {
      delay,
      fixture,
    }).as('getProfile');
    cy.intercept('GET', `http://localhost:8080/api/articles?page=1&limit=5&author=${profile.username}`, {
      delay,
      fixture: 'article/articles-page-1.json',
    }).as('getArticles');
  });
});

Cypress.Commands.add('prepareEdit', (delay = 0, fixture = 'article/article.json') => {
  cy.fixture(fixture).then(article => {
    mockServerBuilder('get', `http://localhost:8080/api/articles/${article.slug}`, article);
  });
});

async function mockServerStart(port = 8080) {
  try {
    return await mockServer.start(port);
  } catch (e) {
    mockServer.mockServerConfig = { port: 8080 };
    await mockServer.requestFromMockServer('/stop', {
      method: 'POST',
    });
    mockServer.mockServerConfig = null;
    return mockServer.start(port);
  }
}

function mockServerEnd() {
  return mockServer.stop();
}

function mockServerBuilder(method, url, response, statusCode = 200) {
  return mockServer[method](url).thenReply(statusCode, JSON.stringify(response));
}
