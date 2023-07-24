declare namespace Cypress {
  interface Cypress {
    env(key: 'users'): {
      [key: string]: {
        email: string;
        password: string;
      };
    };
  }
}
