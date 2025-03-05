describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays all dashboard sections', () => {
    cy.contains('Welcome back, Richard!');
    cy.contains('Office Attendance');
    cy.contains('Team Engagement');
    cy.contains('Collaboration Score');
    cy.contains('Goals Progress');
    cy.contains('Executive Team Updates');
    cy.contains('Recent Achievements');
  });

  it('shows correct navigation items', () => {
    cy.contains('Dashboard');
    cy.contains('My Schedule');
    cy.contains('Rewards');
    cy.contains('Feedback');
    cy.contains('Team');
    cy.contains('Analytics');
  });
});