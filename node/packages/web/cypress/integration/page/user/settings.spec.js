describe('Settings', () => {
  let user = null;
  let file = null;
  beforeEach(() => {
    cy.fixture('user.json').then(u => {
      user = u;
    });
    file = {
      id: 1,
    };
  });

  it('should be show content', () => {
    cy.login();
    cy.visit('http://localhost:3000/user/settings');
    cy.get('[data-cy=head-title]').contains('SETTINGS');
    cy.get('[data-cy=user-image] > div > span > img')
      .should('have.attr', 'srcset')
      .and('contain', encodeURIComponent(user.image));
    cy.get('[data-cy=content-form-input-id]').should('have.attr', 'placeholder', 'Id');
    cy.get('[data-cy=content-form-input-username]').should('have.attr', 'placeholder', `Username`);
    cy.get('[data-cy=content-form-input-bio]').should('have.attr', 'placeholder', `Short bio about you`);
    cy.get('[data-cy=content-form-input-email]').should('have.attr', 'placeholder', 'Email');
    cy.get('[data-cy=content-form-input-password]').should('have.attr', 'placeholder', 'New Password');
    cy.get('[data-cy=content-form-button-submit]').contains('Update Settings');
    cy.get('[data-cy=content-button-logout]').contains('Or click here to logout');
    cy.get('[data-cy=content-form-upload]').contains('Upload new profile');
    cy.get('[data-cy=content-form-input-id]').should('have.attr', 'value', user.id);
    cy.get('[data-cy=content-form-input-username]').should('have.attr', 'value', user.username);
    cy.get('[data-cy=content-form-input-bio]').contains(user.bio);
  });

  it('should update settings', () => {
    const inputPassword = 'test';
    cy.login();
    cy.visit('http://localhost:3000/user/settings');
    cy.intercept('PUT', `http://localhost:8080/api/users`).as('updateSettings');
    cy.get('[data-cy=content-form-input-username]').clear().type(user.username);
    cy.get('[data-cy=content-form-input-bio]').clear().type(user.bio);
    cy.get('[data-cy=content-form-input-email]').clear().type(user.email);
    cy.get('[data-cy=content-form-input-password]').clear().type(inputPassword);
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.wait('@updateSettings').then(({ request }) => {
      const { body } = request;
      expect(body.id).to.equal(user.id);
      expect(body.username).to.equal(user.username);
      expect(body.bio).to.equal(user.bio);
      expect(body.email).to.equal(user.email);
      expect(body.password).to.equal(inputPassword);
    });
  });

  it('should upload profile', () => {
    cy.login();
    cy.visit('http://localhost:3000/user/settings');
    cy.intercept('POST', `http://localhost:8080/api/file/upload`).as('uploadFile');
    cy.get('[data-cy=content-form-upload] > input').attachFile('/profile.jpg');
    cy.intercept('PUT', `http://localhost:8080/api/users`).as('updateSettings');

    cy.wait('@uploadFile').then(({ request }) => {
      const { body } = request;
      expect(body).to.exist;
    });
    cy.wait('@updateSettings').then(({ request }) => {
      const { body } = request;
      expect(body.id).to.equal(user.id);
      expect(body.image).to.equal(file.id);
    });
  });

  it('should logout', () => {
    cy.login();
    cy.visit('http://localhost:3000/user/settings');
    cy.intercept('POST', '/api/auth/logout').as('logout');
    cy.get('[data-cy=content-button-logout]').click();
    cy.wait('@logout');
    cy.location('pathname').should('eq', '/');
  });
});
