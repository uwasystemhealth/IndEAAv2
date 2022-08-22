export const loginWithEmailAndPassword = (email: string, password: string) => {
  cy.get('[data-testid=email]').type(email);
  cy.get('[data-testid=password]').type(password);
  cy.get('[data-testid=submit]').click();
};

export const loginPresetUser = (user = 'admin', startLoadInLoginPage = true) => {
  if (startLoadInLoginPage) {
    cy.visit(`${Cypress.env('BASE_URL')}/login`);
  }
  const { email, password } = Cypress.env('users')[user];
  loginWithEmailAndPassword(email, password);
};

export const logOut = () => {
  cy.get('[data-testid=logout-button]').click();
};

export const logOutByLocalStorage = () => {
  cy.clearLocalStorage();
};
