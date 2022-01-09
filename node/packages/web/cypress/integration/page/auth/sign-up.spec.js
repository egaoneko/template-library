describe('Sign up', () => {
  let form = null;
  beforeEach(() => {
    form = {
      email: 'jake@jake.jake',
      username: 'Jacob',
      password: 'jakejake',
    };
  });

  it('should be show content', () => {
    cy.visit('http://localhost:3000/auth/sign-up');
    cy.get('[data-cy=head-title]').contains('REGISTER');
    cy.get('[data-cy=content-page-title]').contains('Sign Up');
    cy.get('[data-cy=content-sign-in-link]').contains('Have an account?');
    cy.get('[data-cy=content-form-input-username]').should('have.attr', 'placeholder', 'Username');
    cy.get('[data-cy=content-form-input-email]').should('have.attr', 'placeholder', 'Email');
    cy.get('[data-cy=content-form-input-password]').should('have.attr', 'placeholder', 'Password');
    cy.get('[data-cy=content-form-button-submit]').contains('Sing up');
  });

  it('should navigate to the sign in page by link', () => {
    cy.visit('http://localhost:3000/auth/sign-up');
    cy.get('[data-cy=content-sign-in-link]').click();
    cy.location('pathname').should('eq', '/auth/sign-in');
  });

  it('should sign up by button', () => {
    cy.intercept('POST', '/api/auth/register').as('register');
    cy.visit('http://localhost:3000/auth/sign-up');
    cy.get('[data-cy=content-form-input-username]').type(form.username);
    cy.get('[data-cy=content-form-input-email]').type(form.email);
    cy.get('[data-cy=content-form-input-password]').type(form.password);
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.wait('@register').then(({ request }) => {
      const { body } = request;
      expect(body.username).to.equal(form.username);
      expect(body.email).to.equal(form.email);
      expect(body.password).to.equal(form.password);
    });
    cy.location('pathname').should('eq', '/auth/sign-in');
  });

  it('should sign up by enter', () => {
    cy.intercept('POST', '/api/auth/register').as('register');
    cy.visit('http://localhost:3000/auth/sign-up');
    cy.get('[data-cy=content-form-input-username]').type(form.username);
    cy.get('[data-cy=content-form-input-email]').type(form.email);
    cy.get('[data-cy=content-form-input-password]').type(form.password).type('{enter}');
    cy.wait('@register').then(({ request }) => {
      const { body } = request;
      expect(body.username).to.equal(form.username);
      expect(body.email).to.equal(form.email);
      expect(body.password).to.equal(form.password);
    });
    cy.location('pathname').should('eq', '/auth/sign-in');
  });

  it('should sign up without input', () => {
    cy.visit('http://localhost:3000/auth/sign-up');
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.get('[data-cy=form-input-errors]').should('have.length', 3);
    cy.get('[data-cy=form-input-errors]').eq(0).contains('username is required');
    cy.get('[data-cy=form-input-errors]').eq(1).contains('email is required');
    cy.get('[data-cy=form-input-errors]').eq(2).contains('password is required');
  });
});
