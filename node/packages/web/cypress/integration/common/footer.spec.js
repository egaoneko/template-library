describe('Footer', () => {
  it('should navigate to the main page by logo', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=footer-logo-link]').contains('conduit').click();
    cy.location('pathname').should('eq', '/');
  });

  it('should navigate to the site by site link', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-cy=footer-site-link]').should('have.attr', 'href', 'https://thinkster.io/').contains('Thinkster');
  });
});
