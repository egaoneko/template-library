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
import { getRemote } from 'mockttp';

const mockServer = getRemote();

Cypress.Commands.add('mockServerStart', port => {
  return mockServerStart(port);
});

Cypress.Commands.add('mockServerStop', () => {
  return mockServerEnd();
});

Cypress.Commands.add('mockServerBuilder', (method, url) => {
  return mockServerBuilder(method, url);
});

Cypress.Commands.add('login', (email, password) => {
  cy.fixture('user/user.json').then(user => {
    let response;
    if (email !== user.email) {
      response = {
        statusCode: 401,
        body: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      };
    } else {
      response = {
        statusCode: 200,
        body: user,
      };
      cy.setCookie('RW_AT', user.token);
      if (user.refreshToken) {
        cy.setCookie('RW_RT', user.refreshToken);
      }
    }
    cy.intercept('POST', '/api/auth/login', req => {
      const date = new Date();
      date.setDate(date.getDate() + 7);

      req.continue(res => {
        res.headers = {};
        res.headers['Set-Cookie'] = [`RW_AT=${user.token}; Path=/; Expires=${date.toUTCString()}; HttpOnly`];
        res.send(response);
      });
    }).as('login');
    cy.intercept('GET', 'http://localhost:8080/api/users', req => {
      req.continue(res => {
        res.send(response);
      });
    }).as('getCurrentUser');

    // https://stackoverflow.com/questions/47631821/mocking-server-for-ssr-react-app-e2e-tests-with-cypress-io
    mockServerBuilder('get', '/api/users').thenReply(response.statusCode, JSON.stringify(response.body));
  });
});

Cypress.Commands.add('prepareHome', (delay = 0) => {
  cy.intercept('GET', 'http://localhost:8080/api/articles?page=*&limit=*', {
    delay,
    fixture: 'article/articles.json',
  }).as('getArticles');
  cy.intercept('GET', 'http://localhost:8080/api/articles/tags', { delay, fixture: 'article/tags.json' }).as('getTags');
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

function mockServerBuilder(method, url) {
  return mockServer[method](url);
}
