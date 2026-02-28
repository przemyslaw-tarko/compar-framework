describe('Bookstore smoke (Cypress)', () => {
  it('loads homepage', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.title().should('not.be.empty');
  });
});
