describe('Schedule', () => {
  beforeEach(() => {
    cy.visit('/schedule');
  });

  it('displays schedule page with all sections', () => {
    cy.contains('Team Schedule');
    cy.contains("This Week's Progress");
    cy.contains('Office Day Requirements');
  });

  it('allows work location selection', () => {
    cy.contains('Office').click();
    cy.contains('Remote').click();
    cy.contains('Flexible').click();
  });

  it('shows team availability', () => {
    cy.contains('Team Plans');
    cy.contains('Department Summary');
  });

  it('validates RTO policy compliance', () => {
    cy.contains('Office Day Requirements');
    cy.get('[data-testid="policy-status"]').should('exist');
  });
});