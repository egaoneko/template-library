describe('Profile', () => {
  let profile = null;
  beforeEach(() => {
    cy.fixture('profile/user.json').then(p => {
      profile = p;
    });
  });

  it('should be show content', () => {
    cy.prepareProfile();
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.wait('@getProfile');
    cy.get('[data-cy=head-title]').contains('PROFILE');
    cy.get('[data-cy=profile-image] > div > span > img').should('have.attr', 'srcset').and('contain', encodeURIComponent(profile.image));
    cy.get('[data-cy=profile-username]').contains(profile.username);
    cy.get('[data-cy=profile-bio]').contains(profile.bio);
  });

  it('should be show articles', () => {
    cy.prepareProfile(300);
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.get('[data-cy=tab-nav-my_posts]').contains('My Posts');
    cy.get('[data-cy=tab-pane-my_posts]').contains('Loading articles.');
    cy.wait('@getArticles');
    cy.get('[data-cy=feed-container]').should('have.length', 5);
    cy.get('.pagination-page-item').should('have.length', 2);
    cy.intercept('GET', `http://localhost:8080/api/articles?page=2&limit=5&author=${profile.username}`, {
      delay: 300,
      fixture: 'article/articles-page-2.json',
    }).as('getArticlesPage2');
    cy.get('.pagination-page-item').eq(1).click();
    cy.wait('@getArticlesPage2');
    cy.get('[data-cy=feed-container]').should('have.length', 1);
  });

  it('should be show articles after login', () => {
    cy.prepareProfile(200);
    cy.mockServerStart(8080);
    cy.login();
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.intercept('GET', `http://localhost:8080/api/articles?page=1&limit=5&favorited=${profile.username}`, {
      delay: 200,
      fixture: 'article/favorited.json',
    }).as('getFavorited');
    cy.get('[data-cy=tab-nav-favorited_posts]').contains('Favorited Posts');
    cy.get('[data-cy=tab-nav-favorited_posts]').click();
    cy.get('[data-cy=tab-pane-favorited_posts]').contains('Loading articles.');
    cy.wait('@getFavorited');
    cy.get('[data-cy=feed-container]').should('have.length', 3);
    cy.mockServerStop();
  });

  it('should navigate article', () => {
    cy.prepareProfile();
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.wait('@getArticles');
    cy.get('[data-cy=feed-content]').eq(0).click();
    cy.prepareArticle();
    cy.wait('@getArticle');
    cy.fixture('article/articles-page-1.json').then(articles => {
      cy.location('pathname').should('eq', `/article/${articles.list[0].slug}`);
    });
  });

  it('should navigate profile', () => {
    cy.prepareProfile();
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.wait('@getArticles');
    cy.get('[data-cy=feed-profile] > a').eq(0).click();
    cy.prepareProfile();
    cy.wait('@getProfile');
    cy.fixture('article/articles-page-1.json').then(articles => {
      cy.location('pathname').should('eq', `/profile/${articles.list[0].author.username}`);
    });
  });

  it('should toggle favorite', () => {
    cy.prepareProfile();
    cy.mockServerStart(8080);
    cy.login();
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.wait('@getArticles');
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

  it('should toggle follow', () => {
    cy.prepareProfile();
    cy.mockServerStart(8080);
    cy.login('user/other-user.json');
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.wait('@getArticles');
    cy.intercept('POST', `http://localhost:8080/api/profiles/${profile.username}/follow`, {
      fixture: 'article/article.json',
    }).as('follow');
    cy.get('[data-cy=profile-follow]').click();
    cy.wait('@follow');
    cy.mockServerStop();
  });

  it('should toggle unfollow', () => {
    cy.prepareProfile(0, 'profile/other-user.json');
    cy.mockServerStart(8080);
    cy.login();
    cy.fixture('profile/other-user.json').then(profile => {
      cy.visit(`http://localhost:3000/profile/${profile.username}`);
      cy.wait('@getArticles');
      cy.intercept('DELETE', `http://localhost:8080/api/profiles/${profile.username}/follow`, {
        fixture: 'article/article.json',
      }).as('unfollow');
      cy.get('[data-cy=profile-follow]').click();
      cy.wait('@unfollow');
    });
    cy.mockServerStop();
  });

  it('should not toggle with self', () => {
    cy.prepareProfile();
    cy.mockServerStart(8080);
    cy.login();
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.wait('@getArticles');
    cy.get('[data-cy=profile-follow]').should('not.exist');
    cy.mockServerStop();
  });
});
