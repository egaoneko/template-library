describe('Settings', () => {
  let user = null;
  beforeEach(() => {
    cy.fixture('user/user.json').then(u => {
      user = u;
    });
  });

  it('should be show content', () => {
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/user/settings');
    cy.get('[data-cy=head-title]').contains('SETTINGS');
    cy.get('[data-cy=user-image] > div > span > img').should('have.attr', 'srcset').and('contain', encodeURIComponent(user.image));
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
    cy.mockServerStop();
  });

  it('should update settings', () => {
    const inputPassword = 'test';
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/user/settings');
    cy.intercept('PUT', `http://localhost:8080/api/users`, {
      fixture: 'user/user.json',
    }).as('updateSettings');
    cy.get('[data-cy=content-form-input-username]').clear().type(user.username);
    cy.get('[data-cy=content-form-input-bio]').clear().type(user.bio);
    cy.get('[data-cy=content-form-input-email]').clear().type(user.email);
    cy.get('[data-cy=content-form-input-password]').clear().type(inputPassword);
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.wait('@updateSettings').then(({request}) => {
      const {body} = request;
      expect(body.id).to.equal(user.id);
      expect(body.username).to.equal(user.username);
      expect(body.bio).to.equal(user.bio);
      expect(body.email).to.equal(user.email);
      expect(body.password).to.equal(inputPassword);
    });
    cy.mockServerStop();
  });

  it('should upload profile', () => {
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/user/settings');
    cy.intercept('POST', `http://localhost:8080/api/file/upload`, {
      fixture: 'file/upload.json',
    }).as('uploadFile');
    cy.get('[data-cy=content-form-upload] > input').attachFile('/file/profile.jpg');
    cy.intercept('PUT', `http://localhost:8080/api/users`, {
      fixture: 'user/user.json',
    }).as('updateSettings');

    cy.wait('@uploadFile').then(({request}) => {
      const {body} = request;
      expect(body).to.exist;
    });

    cy.fixture('file/upload.json').then(file => {
      cy.wait('@updateSettings').then(({request}) => {
        const {body} = request;
        expect(body.id).to.equal(user.id);
        expect(body.image).to.equal(file.id);
      });
    });
    cy.mockServerStop();
  });

  it('should logout', () => {
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/user/settings');
    cy.intercept('GET', '/api/auth/logout', req => req.continue(res => res.send({statusCode: 200}))).as('logout');
    cy.get('[data-cy=content-button-logout]').click();
    cy.prepareHome();
    cy.wait('@logout');
    cy.location('pathname').should('eq', '/');
    cy.mockServerStop();
  });
});
