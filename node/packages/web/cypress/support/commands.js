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
import '@mocks-server/cypress-commands';

Cypress.Commands.add('login', (email = 'jake@jake.jake') => {
  cy.request('POST', 'http://localhost:8080/api/auth/login', { email }).as('login');
  cy.get('@login').then(response => {
    cy.setCookie('RW_AT', response.body.token);
    cy.setCookie('RW_RT', response.body.refreshToken);
  });
});
