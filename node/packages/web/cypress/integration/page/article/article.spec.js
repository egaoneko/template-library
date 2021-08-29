import format from 'date-fns/format';
describe('Article', () => {
  let article = null;
  let comments = null;
  beforeEach(() => {
    cy.fixture('article/article.json').then(a => {
      article = a;
    });
    cy.fixture('article/comments.json').then(c => {
      comments = c;
    });
  });

  it('should be show content', () => {
    cy.prepareArticle();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait(['@getArticle', '@geComments']);
    cy.get('[data-cy=head-title]').contains('ARTICLE');
    cy.get('[data-cy=article-banner-author-image] > div > img').should('have.attr', 'src', article.author.image);
    cy.get('[data-cy=article-banner-author-username] > a').should(
      'have.attr',
      'href',
      `/profile/${article.author.username}`,
    );
    cy.get('[data-cy=article-banner-author-date]').contains(format(new Date(article.updatedAt), 'EEE MMM d yyyy'));
    cy.get('[data-cy=article-banner-author-date]').contains(format(new Date(article.updatedAt), 'EEE MMM d yyyy'));
    cy.get('[data-cy=article-content-body]').contains('It takes a Jacobian');
    cy.get('[data-cy=article-content-tags]').should('have.length', 2);
    cy.get('[data-cy=article-content-author-image] > div > img').should('have.attr', 'src', article.author.image);
    cy.get('[data-cy=article-content-author-username] > a').should(
      'have.attr',
      'href',
      `/profile/${article.author.username}`,
    );
    cy.get('[data-cy=comment-container]').should('have.length', 2);
    cy.get('[data-cy=comment-container]').eq(0).contains('It takes a Jacobian');
    cy.get('[data-cy=comment-form-container]').should('not.exist');
  });

  it('should toggle follow', () => {
    cy.prepareArticle();
    cy.mockServerStart(8080);
    cy.login('user/other-user.json');
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait('@getArticle');
    cy.intercept('POST', `http://localhost:8080/api/profiles/${article.author.username}/follow`, {
      fixture: 'article/article.json',
    }).as('bannerFollow');
    cy.get('[data-cy=article-banner-follow]').click();
    cy.wait('@bannerFollow');
    cy.intercept('POST', `http://localhost:8080/api/profiles/${article.author.username}/follow`, {
      fixture: 'article/article.json',
    }).as('contentFollow');
    cy.get('[data-cy=article-content-follow]').click();
    cy.wait('@contentFollow');
    cy.mockServerStop();
  });

  it('should toggle unfollow', () => {
    cy.prepareArticle(0, 'article/other-article.json');
    cy.mockServerStart(8080);
    cy.login('user/other-user.json');
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait('@getArticle');
    cy.intercept('DELETE', `http://localhost:8080/api/profiles/${article.author.username}/follow`, {
      fixture: 'article/other-article.json',
    }).as('bannerUnfollow');
    cy.get('[data-cy=article-banner-follow]').click();
    cy.wait('@bannerUnfollow');
    cy.intercept('DELETE', `http://localhost:8080/api/profiles/${article.author.username}/follow`, {
      fixture: 'article/other-article.json',
    }).as('contentUnfollow');
    cy.get('[data-cy=article-content-follow]').click();
    cy.wait('@contentUnfollow');
    cy.mockServerStop();
  });

  it('should toggle favorite', () => {
    cy.prepareArticle();
    cy.mockServerStart(8080);
    cy.login('user/other-user.json');
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait('@getArticle');
    cy.intercept('POST', `http://localhost:8080/api/articles/${article.slug}/favorite`, {
      fixture: 'article/article.json',
    }).as('bannerFavorite');
    cy.get('[data-cy=article-banner-favorite]').click();
    cy.wait('@bannerFavorite');
    cy.intercept('POST', `http://localhost:8080/api/articles/${article.slug}/favorite`, {
      fixture: 'article/article.json',
    }).as('contentFavorite');
    cy.get('[data-cy=article-content-favorite]').click();
    cy.wait('@contentFavorite');
    cy.mockServerStop();
  });

  it('should toggle unfavorite', () => {
    cy.prepareArticle(0, 'article/other-article.json');
    cy.mockServerStart(8080);
    cy.login('user/other-user.json');
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait('@getArticle');
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article.slug}/favorite`, {
      fixture: 'article/article.json',
    }).as('bannerUnfavorite');
    cy.get('[data-cy=article-banner-favorite]').click();
    cy.wait('@bannerUnfavorite');
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article.slug}/favorite`, {
      fixture: 'article/article.json',
    }).as('contentUnfavorite');
    cy.get('[data-cy=article-content-favorite]').click();
    cy.wait('@contentUnfavorite');
    cy.mockServerStop();
  });

  it('should post comment', () => {
    const commentBody = 'test';

    cy.prepareArticle();
    cy.mockServerStart(8080);
    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait('@getArticle');
    cy.intercept('POST', `http://localhost:8080/api/articles/${article.slug}/comments`, {
      fixture: 'article/comment.json',
    }).as('postComment');
    cy.get('[data-cy=comment-form-input-text]').type(commentBody);
    cy.get('[data-cy=comment-form-user-submit]').click();
    cy.wait('@postComment').then(({ request }) => {
      const { body } = request;
      expect(body.body).to.equal(commentBody);
    });
    cy.mockServerStop();
  });

  it('should delete comment', () => {
    cy.prepareArticle();
    cy.mockServerStart(8080);
    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait('@getArticle');
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article.slug}/comments/${comments.list[0].id}`, req =>
      req.continue(res => res.send({ statusCode: 200 })),
    ).as('deleteComment');
    cy.get('[data-cy=comment-delete-button]').should('have.length', 1);
    cy.get('[data-cy=comment-delete-button]').click();
    cy.wait('@deleteComment');
    cy.mockServerStop();
  });

  it('should delete post', () => {
    cy.prepareArticle();
    cy.mockServerStart(8080);
    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait('@getArticle');
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article.slug}`, req =>
      req.continue(res => res.send({ statusCode: 200 })),
    ).as('bannerDeleteArticle');
    cy.get('[data-cy=article-banner-delete-article]').click();
    cy.wait('@bannerDeleteArticle');
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article.slug}`, req =>
      req.continue(res => res.send({ statusCode: 200 })),
    ).as('contentDeleteArticle');
    cy.get('[data-cy=article-content-delete-article]').click();
    cy.wait('@contentDeleteArticle');
    cy.mockServerStop();
  });

  it('should navigate edit button in banner', () => {
    cy.prepareArticle();
    cy.mockServerStart(8080);
    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait('@getArticle');
    cy.get('[data-cy=article-banner-edit-article]').click();
    cy.prepareEdit();
    cy.location('pathname').should('eq', `/editor/${article.slug}`);
    cy.mockServerStop();
  });

  it('should navigate edit button in content', () => {
    cy.prepareArticle();
    cy.mockServerStart(8080);
    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.wait('@getArticle');
    cy.get('[data-cy=article-content-edit-article]').click();
    cy.prepareEdit();
    cy.location('pathname').should('eq', `/editor/${article.slug}`);
    cy.mockServerStop();
  });
});
