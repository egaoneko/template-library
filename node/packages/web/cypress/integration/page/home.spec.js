describe('Home', () => {
  let article = null;
  let article2 = null;
  beforeEach(() => {
    cy.fixture('article.json').then(a => {
      article = a;
    });
    article2 = 'how-to-train-your-dragon-2';
  });

  it('should navigate article', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=feed-content]').eq(0).click();
    cy.location('pathname').should('eq', `/article/${article.slug}`);
  });

  it('should navigate profile', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=feed-profile] > a').eq(0).click();
    cy.location('pathname').should('eq', `/profile/${article.author.username}`);
  });

  it('should be show content', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=head-title]').contains('HOME');
    cy.get('[data-cy=banner-title]').contains('conduit');
    cy.get('[data-cy=banner-description]').contains('A place to share your knowledge.');
  });

  it('should be show articles', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=feed-container]').should('have.length', 5);
    cy.get('.pagination-page-item').should('have.length', 2);
    cy.get('.pagination-page-item').eq(1).click();
    cy.get('[data-cy=feed-container]').should('have.length', 3);
  });

  it('should be show articles after login', () => {
    cy.login();
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=tab-nav-user_feed]').contains('Your Feed');
    cy.get('[data-cy=tab-nav-user_feed]').click();
    cy.get('[data-cy=feed-container]').should('have.length', 3);
  });

  it('should be show tags', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=content-tags-header]').contains('Popular Tags');
    cy.get('[data-cy=content-tag]').should('have.length', 2);
  });

  it('should be show articles by tag', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=content-tag]').eq(0).click();
    cy.get('[data-cy=feed-container]').should('have.length', 2);
  });

  it('should toggle favorite', () => {
    cy.login();
    cy.visit('http://localhost:3000/');
    cy.intercept('POST', `http://localhost:8080/api/articles/${article.slug}/favorite`).as('favorite');
    cy.get('[data-cy=feed-favorite]').eq(0).click();
    cy.wait('@favorite');
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article2}/favorite`).as('unfavorite');
    cy.get('[data-cy=feed-favorite]').eq(1).click();
    cy.wait('@unfavorite');
  });
});
