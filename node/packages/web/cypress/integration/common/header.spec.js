describe('Header', () => {
  let user = null;
  beforeEach(() => {
    cy.fixture('user/user.json').then(u => {
      user = u;
    });
    cy.prepareHome();
  });

  it('should navigate to the main page by logo', () => {
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=header-logo-link]').contains('conduit').click();
    cy.location('pathname').should('eq', '/');
  });

  it('should navigate to the sign in page by home', () => {
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=header-home-link]').contains('Home').click();
    cy.location('pathname').should('eq', '/');
  });

  it('should navigate to the sign in page by sign in', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=header-sign-in-link]').contains('Sign in').click();
    cy.location('pathname').should('eq', '/auth/sign-in');
  });

  it('should navigate to the sign in page by sign up', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=header-sign-up-link]').contains('Sign up').click();
    cy.location('pathname').should('eq', '/auth/sign-up');
  });

  it('should navigate to the sign in page by home after login', () => {
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=header-home-link]').contains('Home').click();
    cy.location('pathname').should('eq', '/');
    cy.mockServerStop();
  });

  it('should navigate to the new post page after login', () => {
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=header-new-post-link]').contains('New Post').click();
    cy.location('pathname').should('eq', '/editor/new');
    cy.mockServerStop();
  });

  it('should navigate to the settings page after login', () => {
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=header-settings-link]').contains('Settings').click();
    cy.location('pathname').should('eq', '/user/settings');
    cy.mockServerStop();
  });

  it('should navigate to the profile page after login', () => {
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=header-profile-link]').contains(user.username).click();
    cy.location('pathname').should('eq', `/profile/${user.username}`);
    cy.mockServerStop();
  });
});
