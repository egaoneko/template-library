describe('Sign in', () => {
  let form = null;
  beforeEach(() => {
    cy.fixture('auth/sign-in-form.json').then(f => {
      form = f;
    });
    cy.prepareHome(200);
  });

  it('should be show content', () => {
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=head-title]').contains('LOGIN');
    cy.get('[data-cy=content-page-title]').contains('Sign In');
    cy.get('[data-cy=content-sign-up-link]').contains('Need an account?');
    cy.get('[data-cy=content-form-input-email]').should('have.attr', 'placeholder', 'Email');
    cy.get('[data-cy=content-form-input-password]').should('have.attr', 'placeholder', 'Password');
    cy.get('[data-cy=content-form-button-submit]').contains('Sing in');
  });

  it('should navigate to the sign up page by link', () => {
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=content-sign-up-link]').click();
    cy.location('pathname').should('eq', '/auth/sign-up');
  });

  it('should sign up by button', () => {
    cy.intercept('POST', '/api/auth/login', { fixture: 'user/user.json' }).as('login');
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=content-form-input-email]').type(form.email);
    cy.get('[data-cy=content-form-input-password]').type(form.password);
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.wait('@login');
    cy.location('pathname').should('eq', '/');
  });

  it('should sign up by enter', () => {
    cy.intercept('POST', '/api/auth/login', { fixture: 'user/user.json' }).as('login');
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=content-form-input-email]').type(form.email);
    cy.get('[data-cy=content-form-input-password]').type(form.password).type('{enter}');
    cy.wait('@login');
    cy.location('pathname').should('eq', '/');
  });

  it('should sign up by enter without input', () => {
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.get('[data-cy=form-input-errors]').should('have.length', 2);
    cy.get('[data-cy=form-input-errors]').eq(0).contains('email is required');
    cy.get('[data-cy=form-input-errors]').eq(1).contains('password is required');
  });
});
