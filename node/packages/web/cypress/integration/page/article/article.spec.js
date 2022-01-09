import format from 'date-fns/format';

describe('Article', () => {
  let article = null;
  let otherArticle = null;
  let comment = null;
  beforeEach(() => {
    cy.fixture('article.json').then(a => {
      article = a;
      otherArticle = {
        slug: 'how-to-train-your-dragon-3',
        title: 'How to train your dragon 3',
        description: 'So toothless',
        body: 'It a dragon',
        tagList: ['training'],
        createdAt: '2016-02-18T03:22:56.637Z',
        updatedAt: '2016-02-18T03:48:35.824Z',
        favorited: true,
        favoritesCount: 3,
        author: {
          username: 'Jacob',
          bio: 'I work at statefarm',
          image: 'https://i.stack.imgur.com/xHWG8.jpg',
          following: true,
        },
      };
    });
    cy.fixture('comment.json').then(c => {
      comment = c;
    });
  });

  it('should be show content', () => {
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.get('[data-cy=head-title]').contains('ARTICLE');
    cy.get('[data-cy=article-banner-author-image] > div > span > img')
      .should('have.attr', 'srcset')
      .and('contain', encodeURIComponent(article.author.image));
    cy.get('[data-cy=article-banner-author-username] > a').should(
      'have.attr',
      'href',
      `/profile/${article.author.username}`,
    );
    cy.get('[data-cy=article-banner-author-date]').contains(format(new Date(article.updatedAt), 'EEE MMM d yyyy'));
    cy.get('[data-cy=article-banner-author-date]').contains(format(new Date(article.updatedAt), 'EEE MMM d yyyy'));
    cy.get('[data-cy=article-content-body]').contains('It takes a Jacobian');
    cy.get('[data-cy=article-content-tags]').should('have.length', 2);
    cy.get('[data-cy=article-content-author-image] > div > span > img')
      .should('have.attr', 'srcset')
      .and('contain', encodeURIComponent(article.author.image));
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
    cy.login('jake-other@jake.jake');
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.intercept('POST', `http://localhost:8080/api/profiles/${article.author.username}/follow`).as('bannerFollow');
    cy.get('[data-cy=article-banner-follow]').click();
    cy.wait('@bannerFollow');
    cy.intercept('POST', `http://localhost:8080/api/profiles/${article.author.username}/follow`).as('contentFollow');
    cy.get('[data-cy=article-content-follow]').click();
    cy.wait('@contentFollow');
  });

  it('should toggle unfollow', () => {
    cy.login('jake-other@jake.jake');
    cy.visit(`http://localhost:3000/article/${otherArticle.slug}`);
    cy.intercept('DELETE', `http://localhost:8080/api/profiles/${otherArticle.author.username}/follow`).as(
      'bannerUnfollow',
    );
    cy.get('[data-cy=article-banner-follow]').click();
    cy.wait('@bannerUnfollow');
    cy.intercept('DELETE', `http://localhost:8080/api/profiles/${otherArticle.author.username}/follow`).as(
      'contentUnfollow',
    );
    cy.get('[data-cy=article-content-follow]').click();
    cy.wait('@contentUnfollow');
  });

  it('should toggle favorite', () => {
    cy.login('jake-other@jake.jake');
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.intercept('POST', `http://localhost:8080/api/articles/${article.slug}/favorite`).as('bannerFavorite');
    cy.get('[data-cy=article-banner-favorite]').click();
    cy.wait('@bannerFavorite');
    cy.intercept('POST', `http://localhost:8080/api/articles/${article.slug}/favorite`).as('contentFavorite');
    cy.get('[data-cy=article-content-favorite]').click();
    cy.wait('@contentFavorite');
  });

  it('should toggle unfavorite', () => {
    cy.login('jake-other@jake.jake');
    cy.visit(`http://localhost:3000/article/${otherArticle.slug}`);
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${otherArticle.slug}/favorite`).as('bannerUnfavorite');
    cy.get('[data-cy=article-banner-favorite]').click();
    cy.wait('@bannerUnfavorite');
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${otherArticle.slug}/favorite`).as('contentUnfavorite');
    cy.get('[data-cy=article-content-favorite]').click();
    cy.wait('@contentUnfavorite');
  });

  it('should post comment', () => {
    const commentBody = 'test';

    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.intercept('POST', `http://localhost:8080/api/articles/${article.slug}/comments`).as('postComment');
    cy.get('[data-cy=comment-form-input-text]').type(commentBody);
    cy.get('[data-cy=comment-form-user-submit]').click();
    cy.wait('@postComment').then(({ request }) => {
      const { body } = request;
      expect(body.body).to.equal(commentBody);
    });
  });

  it('should delete comment', () => {
    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article.slug}/comments/${comment.id}`).as(
      'deleteComment',
    );
    cy.get('[data-cy=comment-delete-button]').should('have.length', 1);
    cy.get('[data-cy=comment-delete-button]').click();
    cy.wait('@deleteComment');
  });

  it('should delete post', () => {
    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article.slug}`).as('bannerDeleteArticle');
    cy.get('[data-cy=article-banner-delete-article]').click();
    cy.wait('@bannerDeleteArticle');
    cy.intercept('DELETE', `http://localhost:8080/api/articles/${article.slug}`).as('contentDeleteArticle');
    cy.get('[data-cy=article-content-delete-article]').click();
    cy.wait('@contentDeleteArticle');
    cy.location('pathname').should('eq', '/');
  });

  it('should navigate edit button in banner', () => {
    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.get('[data-cy=article-banner-edit-article]').click();
    cy.location('pathname').should('eq', `/editor/edit/${article.slug}`);
  });

  it('should navigate edit button in content', () => {
    cy.login();
    cy.visit(`http://localhost:3000/article/${article.slug}`);
    cy.get('[data-cy=article-content-edit-article]').click();
    cy.location('pathname').should('eq', `/editor/edit/${article.slug}`);
  });
});
