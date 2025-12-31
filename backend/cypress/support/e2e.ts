// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "../e2e/api";
import "@testing-library/cypress/add-commands";

// Reset state before each test
beforeEach(() => {
  // Clear all intercepts
  cy.intercept("POST", "/api/logs*", null);

  // Mock any global dependencies
  cy.window().then((win) => {
    win.console.error = cy.spy().as("console.error");
    win.console.warn = cy.spy().as("console.warn");
  });
});

// Clean up after each test
afterEach(() => {
  cy.window().then((win) => {
    delete win.console.error;
    delete win.console.warn;
  });
});

