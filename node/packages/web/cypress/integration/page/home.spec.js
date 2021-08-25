describe('Home', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should be show', () => {
    cy.get('[data-cy=head-title]').contains('HOME');
    cy.get('[data-cy=banner-title]').contains('conduit');
    cy.get('[data-cy=banner-description]').contains('A place to share your knowledge.');
  });
});
