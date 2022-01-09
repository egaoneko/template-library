describe('New Article', () => {
  let form = null;
  let article = null;
  beforeEach(() => {
    form = {
      title: 'How to train your dragon',
      description: 'Ever wonder how?',
      body: 'You have to believe',
      tagList: ['reactjs', 'angularjs', 'dragons'],
    };
    cy.fixture('article.json').then(a => {
      article = a;
    });
  });

  it('should be show content', () => {
    cy.login();
    cy.visit('http://localhost:3000/editor/new');
    cy.get('[data-cy=head-title]').contains('POST ARTICLE');
    cy.get('[data-cy=content-form-input-title]').should('have.attr', 'placeholder', 'Article Title');
    cy.get('[data-cy=content-form-input-description]').should('have.attr', 'placeholder', `What's this article about?`);
    cy.get('[data-cy=content-form-input-body]').should('have.attr', 'placeholder', 'Write your article (in markdown)');
    cy.get('[data-cy=content-form-input-tags]').should('have.attr', 'placeholder', 'Enter tags');
    cy.get('[data-cy=content-form-button-submit]').contains('Publish Article');
  });

  it('should publish article', () => {
    cy.login();
    cy.visit('http://localhost:3000/editor/new');
    cy.intercept('POST', `http://localhost:8080/api/articles`).as('publishArticle');
    cy.get('[data-cy=content-form-input-title]').type(form.title);
    cy.get('[data-cy=content-form-input-description]').type(form.description);
    cy.get('[data-cy=content-form-input-body]').type(form.body);
    form.tagList.forEach(tag => cy.get('[data-cy=content-form-input-tags]').type(tag).type('{enter}'));
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.wait('@publishArticle').then(({ request }) => {
      const { body } = request;
      expect(body.title).to.equal(form.title);
      expect(body.description).to.equal(form.description);
      expect(body.body).to.equal(form.body);
      expect(body.tagList).to.deep.equal(form.tagList);
    });
    cy.location('pathname').should('eq', `/article/${article.slug}`);
  });

  it('should publish article without input', () => {
    cy.login();
    cy.visit('http://localhost:3000/editor/new');
    cy.get('[data-cy=content-form-button-submit]').click();
    cy.get('[data-cy=form-input-errors]').should('have.length', 3);
    cy.get('[data-cy=form-input-errors]').eq(0).contains('title is required');
    cy.get('[data-cy=form-input-errors]').eq(1).contains('description is required');
    cy.get('[data-cy=form-input-errors]').eq(2).contains('body is required');
  });
});
