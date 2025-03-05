describe('Authentication Flow', () => {
  it('automatically logs in as Rich Fairbank', () => {
    cy.visit('/login');
    cy.contains('Welcome, Richard D. Fairbank');
    cy.contains('Chief Executive Officer, Capital One');
    cy.url().should('include', '/');
  });
});