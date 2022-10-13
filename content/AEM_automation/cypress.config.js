const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
      url: "http://localhost:8080"
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    "charts": true,
    "overwrite": false,
    "html": false,
    "json": true,
    "reportDir": "cypress/report/mochawesome-report"
  },
  e2e: {
    specPattern: "**/*.{feature,cy.js}",
    baseUrl: "http://localhost:8080",
    setupNodeEvents(on, config) {
      const cucumber = require('cypress-cucumber-preprocessor').default
      const browserify = require('@cypress/browserify-preprocessor');
      const options = {
        ...browserify.defaultOptions,
      };
      on('file:preprocessor', cucumber(options));
    },
  },
});
