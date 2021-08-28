describe('Home', () => {
  it('should be show content', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=head-title]').contains('HOME');
    cy.get('[data-cy=banner-title]').contains('conduit');
    cy.get('[data-cy=banner-description]').contains('A place to share your knowledge.');
  });

  it('should be show tab', () => {
    cy.prepareHome(200);
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=tab-nav-global_feed]').contains('Global Feed');
    cy.get('[data-cy=tab-pane-global_feed]').contains('Loading articles.');
    cy.get('[data-cy=content-tags-container]').contains('Loading tags.');
    cy.wait('@getArticles');
    cy.wait('@getTags');
    cy.get('[data-cy=feed-container]').should('have.length', 2);
    cy.get('[data-cy=content-tags-header]').contains('Popular Tags');
    cy.get('[data-cy=content-tag]').should('have.length', 2);
  });
});
