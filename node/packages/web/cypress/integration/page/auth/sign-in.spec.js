describe('Sign in', () => {
  let form = null;
  beforeEach(() => {
    form = {
      email: 'jake@jake.jake',
      password: 'jakejake',
    };
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
    cy.intercept('POST', '/api/auth/login').as('login');
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=content-form-input-email]').type(form.email);
    cy.get('[data-cy=content-form-input-password]').type(form.password);
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.wait('@login').then(({ request }) => {
      const { body } = request;
      expect(body.email).to.equal(form.email);
      expect(body.password).to.equal(form.password);
    });
    cy.location('pathname').should('eq', '/');
  });

  it('should sign up by enter', () => {
    cy.intercept('POST', 'http://localhost:8080/api/auth/login').as('login');
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=content-form-input-email]').type(form.email);
    cy.get('[data-cy=content-form-input-password]').type(form.password).type('{enter}');
    cy.wait('@login').then(({ request }) => {
      const { body } = request;
      expect(body.email).to.equal(form.email);
      expect(body.password).to.equal(form.password);
    });
    cy.location('pathname').should('eq', '/');
  });

  it('should sign up without input', () => {
    cy.visit('http://localhost:3000/auth/sign-in');
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.get('[data-cy=form-input-errors]').should('have.length', 2);
    cy.get('[data-cy=form-input-errors]').eq(0).contains('email is required');
    cy.get('[data-cy=form-input-errors]').eq(1).contains('password is required');
  });
});
