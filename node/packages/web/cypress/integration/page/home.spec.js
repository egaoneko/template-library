describe('Home', () => {
  it('should be show content', () => {
    cy.prepareHome();
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=head-title]').contains('HOME');
    cy.get('[data-cy=banner-title]').contains('conduit');
    cy.get('[data-cy=banner-description]').contains('A place to share your knowledge.');
  });

  it('should be show articles', () => {
    cy.prepareHome(300);
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=tab-nav-global_feed]').contains('Global Feed');
    cy.get('[data-cy=tab-pane-global_feed]').contains('Loading articles.');
    cy.wait('@getArticles');
    cy.get('[data-cy=feed-container]').should('have.length', 5);
    cy.get('.pagination-page-item').should('have.length', 2);
    cy.intercept('GET', 'http://localhost:8080/api/articles?page=2&limit=5', {
      delay: 300,
      fixture: 'article/articles-page-2.json',
    }).as('getArticlesPage2');
    cy.get('.pagination-page-item').eq(1).click();
    cy.wait('@getArticlesPage2');
    cy.get('[data-cy=feed-container]').should('have.length', 1);
  });

  it('should be show articles after login', () => {
    cy.prepareHome(200);
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/');
    cy.intercept('GET', 'http://localhost:8080/api/articles/feed?page=1&limit=5', {
      delay: 200,
      fixture: 'article/feed.json',
    }).as('getFeed');
    cy.get('[data-cy=tab-nav-user_feed]').contains('Your Feed');
    cy.get('[data-cy=tab-nav-user_feed]').click();
    cy.get('[data-cy=tab-pane-user_feed]').contains('Loading articles.');
    cy.wait('@getFeed');
    cy.get('[data-cy=feed-container]').should('have.length', 3);
    cy.mockServerStop();
  });

  it('should be show tags', () => {
    cy.prepareHome(300);
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=content-tags-container]').contains('Loading tags.');
    cy.wait('@getTags');
    cy.get('[data-cy=content-tags-header]').contains('Popular Tags');
    cy.get('[data-cy=content-tag]').should('have.length', 2);
  });

  it('should be show articles by tag', () => {
    cy.prepareHome();
    cy.visit('http://localhost:3000/');
    cy.wait(['@getArticles', '@getTags']);
    cy.get('[data-cy=content-tag]').eq(0).click();
    cy.intercept('GET', 'http://localhost:8080/api/articles?page=1&limit=5&tag=dragons', {
      fixture: 'article/articles-tag.json',
    }).as('getArticlesTag');
    cy.wait('@getArticlesTag');
    cy.get('[data-cy=feed-container]').should('have.length', 2);
  });

  it('should navigate article', () => {
    cy.prepareHome();
    cy.visit('http://localhost:3000/');
    cy.wait('@getArticles');
    cy.wait('@getTags');
    cy.get('[data-cy=feed-content]').eq(0).click();
    cy.prepareArticle();
    cy.wait('@getArticle');
    cy.fixture('article/articles-page-1.json').then(articles => {
      cy.location('pathname').should('eq', `/article/${articles.list[0].slug}`);
    });
  });

  it('should navigate profile', () => {
    cy.prepareHome();
    cy.visit('http://localhost:3000/');
    cy.wait('@getArticles');
    cy.wait('@getTags');
    cy.get('[data-cy=feed-profile] > a').eq(0).click();
    cy.prepareProfile();
    cy.wait('@getProfile');
    cy.fixture('article/articles-page-1.json').then(articles => {
      cy.location('pathname').should('eq', `/profile/${articles.list[0].author.username}`);
    });
  });

  it('should toggle favorite', () => {
    cy.prepareHome();
    cy.mockServerStart(8080);
    cy.login();
    cy.visit('http://localhost:3000/');
    cy.wait('@getArticles');
    cy.wait('@getTags');
    cy.fixture('article/articles-page-1.json').then(articles => {
      cy.intercept('POST', `http://localhost:8080/api/articles/${articles.list[0].slug}/favorite`, {
        fixture: 'article/article.json',
      }).as('favorite');
      cy.get('[data-cy=feed-favorite]').eq(0).click();
      cy.wait('@favorite');
      cy.intercept('DELETE', `http://localhost:8080/api/articles/${articles.list[1].slug}/favorite`, {
        fixture: 'article/article.json',
      }).as('unfavorite');
      cy.get('[data-cy=feed-favorite]').eq(1).click();
      cy.wait('@unfavorite');
    });
    cy.mockServerStop();
  });
});
