import { loginPresetUser, logOutByLocalStorage } from '../support/authentication';

describe('Homepage', () => {
  /* ==== Test Created with Cypress Studio ==== */
  it('Goes to the homepage and is able to navigate to login', () => {
    // Just make sure we are logged out
    logOutByLocalStorage();

    cy.visit(`${Cypress.env('BASE_URL')}/`);

    // Navigate to Login page
    cy.get('[data-testid="login-button"]').click();
    loginPresetUser('admin', false);

    // Check that we are back in the homepage
    cy.url().should('include', '/');

    // Check localstorage is no longer empty (we store tokens here)
    cy.window().its('localStorage').should('not.be.empty');
  });
});

export {};
