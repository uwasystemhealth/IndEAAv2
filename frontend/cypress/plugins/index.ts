// Disabling this rule because dependencies being imported are only meant for testing
/* eslint-disable import/no-extraneous-dependencies */

// The libraries are imported here does not fully support Typescript
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
function plugins(on: Cypress.PluginEvents, config: Cypress.PluginConfig) {
  return config;
}

export default plugins;
