import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    users: {
      admin: {
        email: 'admin@admin.com',
        password: 'Password123',
      },
    },
  },
  e2e: {
    experimentalStudio: true,
    defaultCommandTimeout: 10000,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config): void {
      // implement node event listeners here
    },
  },
});
