describe('Profile', () => {
  let profile = null;
  let other = null;
  let article1 = null;
  let article2 = null;
  beforeEach(() => {
    cy.fixture('profile.json').then(p => {
      profile = p;
    });
    other = 'JacobOther';
    article1 = 'how-to-train-your-dragon';
    article2 = 'how-to-train-your-dragon-3';
  });

  it('should be show content', () => {
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.get('[data-cy=head-title]').contains('PROFILE');
    cy.get('[data-cy=profile-image] > div > span > img')
      .should('have.attr', 'srcset')
      .and('contain', encodeURIComponent(profile.image));
    cy.get('[data-cy=profile-username]').contains(profile.username);
    cy.get('[data-cy=profile-bio]').contains(profile.bio);
  });

  it('should be show articles', () => {
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.get('[data-cy=tab-nav-my_posts]').contains('My Posts');
    cy.get('[data-cy=feed-container]').should('have.length', 5);
    cy.get('.pagination-page-item').should('have.length', 2);
    cy.get('.pagination-page-item').eq(1).click();
    cy.get('[data-cy=feed-container]').should('have.length', 1);
  });

  it('should be show articles after login', () => {
    cy.login();
    cy.visit(`http://localhost:3000/profile/${other}`);
    cy.get('[data-cy=tab-nav-favorited_posts]').contains('Favorited Posts');
    cy.get('[data-cy=tab-nav-favorited_posts]').click();
    cy.get('[data-cy=feed-container]').should('have.length', 2);
  });

  it('should navigate article', () => {
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.get('[data-cy=feed-content]').eq(0).click();
    cy.location('pathname').should('eq', `/article/${article1}`);
  });

  it('should navigate profile', () => {
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.get('[data-cy=feed-profile] > a').eq(0).click();
    cy.location('pathname').should('eq', `/profile/${profile.username}`);
  });

  it('should toggle favorite', () => {
    cy.login();
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.intercept('POST', `http://localhost:8080/api/articles/${article1}/favorite`).as('favorite');
    cy.get('[data-cy=feed-favorite]').eq(0).click();
    cy.wait('@favorite');
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article2}/favorite`).as('unfavorite');
    cy.get('[data-cy=feed-favorite]').eq(1).click();
    cy.wait('@unfavorite');
  });

  it('should toggle follow', () => {
    cy.login('jake-other@jake.jake');
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.intercept('POST', `http://localhost:8080/api/profiles/${profile.username}/follow`).as('follow');
    cy.get('[data-cy=profile-follow]').click();
    cy.wait('@follow');
  });

  it('should toggle unfollow', () => {
    cy.login();
    cy.visit(`http://localhost:3000/profile/${other}`);
    cy.intercept('DELETE', `http://localhost:8080/api/profiles/${other}/follow`).as('unfollow');
    cy.get('[data-cy=profile-follow]').click();
    cy.wait('@unfollow');
  });

  it('should not toggle with self', () => {
    cy.login();
    cy.visit(`http://localhost:3000/profile/${profile.username}`);
    cy.get('[data-cy=profile-follow]').should('not.exist');
  });
});
