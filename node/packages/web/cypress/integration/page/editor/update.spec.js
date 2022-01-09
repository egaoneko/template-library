describe('Edit Article', () => {
  let form = null;
  let article = null;
  beforeEach(() => {
    form = {
      title: 'How to train your dragon',
      description: 'Ever wonder how?',
      body: 'You have to believe',
    };
    cy.fixture('article.json').then(a => {
      article = a;
    });
  });

  it('should be show content', () => {
    cy.login();
    cy.visit(`http://localhost:3000/editor/edit/${article.slug}`);
    cy.get('[data-cy=head-title]').contains('EDIT ARTICLE');
    cy.get('[data-cy=content-form-input-title]').should('have.attr', 'placeholder', 'Article Title');
    cy.get('[data-cy=content-form-input-description]').should('have.attr', 'placeholder', `What's this article about?`);
    cy.get('[data-cy=content-form-input-body]').should('have.attr', 'placeholder', 'Write your article (in markdown)');
    cy.get('[data-cy=content-form-input-title]').should('have.attr', 'value', article.title);
    cy.get('[data-cy=content-form-input-description]').should('have.attr', 'value', article.description);
    cy.get('[data-cy=content-form-input-body]').contains(article.body);
    cy.get('[data-cy=content-form-button-submit]').contains('Publish Article');
  });

  it('should publish article', () => {
    cy.login();
    cy.visit(`http://localhost:3000/editor/edit/${article.slug}`);
    cy.intercept('PUT', `http://localhost:8080/api/articles/${article.slug}`).as('publishArticle');
    cy.get('[data-cy=content-form-input-title]').clear().type(form.title);
    cy.get('[data-cy=content-form-input-description]').clear().type(form.description);
    cy.get('[data-cy=content-form-input-body]').clear().type(form.body);
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.wait('@publishArticle').then(({ request }) => {
      const { body } = request;
      expect(body.title).to.equal(form.title);
      expect(body.description).to.equal(form.description);
      expect(body.body).to.equal(form.body);
    });
    cy.location('pathname').should('eq', `/article/${article.slug}`);
  });
});
