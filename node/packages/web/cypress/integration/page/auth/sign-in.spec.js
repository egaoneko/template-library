describe('Sign in', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/auth/sign-in');
  });

  it('should be show', () => {
    cy.get('[data-cy=head-title]').contains('LOGIN');
    cy.get('[data-cy=content-page-title]').contains('Sign In');
    cy.get('[data-cy=content-sign-up-link]').contains('Need an account?');
    cy.get('[data-cy=content-form-input-email]').should('have.attr', 'placeholder', 'Email');
    cy.get('[data-cy=content-form-input-password]').should('have.attr', 'placeholder', 'Password');
    cy.get('[data-cy=content-form-button-submit]').contains('Sing in');
  });

  it('should navigate to the sign up page by link', () => {
    cy.get('[data-cy=content-sign-up-link]').click();
    cy.location('pathname').should('eq', '/auth/sign-up');
  });

  it('should sign up by button', () => {
    const emailText = 'a@a.com';
    const passwordText = '1234';

    cy.intercept('POST', '/api/auth/login', {
      email: emailText,
      password: passwordText,
    });

    cy.get('[data-cy=content-form-input-email]').type(emailText);
    cy.get('[data-cy=content-form-input-password]').type(passwordText);
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.location('pathname').should('eq', '/');
  });

  it('should sign up by enter', () => {
    const emailText = 'a@a.com';
    const passwordText = '1234';

    cy.intercept('POST', '/api/auth/login', {
      email: emailText,
      password: passwordText,
    });
    cy.get('[data-cy=content-form-input-email]').type(emailText);
    cy.get('[data-cy=content-form-input-password]').type(passwordText).type('{enter}');
    cy.location('pathname').should('eq', '/');
  });

  it('should sign up by enter without input', () => {
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.get('[data-cy=form-input-errors]').should('have.length', 2);
    cy.get('[data-cy=form-input-errors]').eq(0).contains('email is required');
    cy.get('[data-cy=form-input-errors]').eq(1).contains('password is required');
  });
});
