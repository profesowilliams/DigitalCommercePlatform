/// <reference types="cypress" />
import { RenewalsGrid } from '../page_objects/renewals_page';
const renewalsGrid = new RenewalsGrid()

describe("Test Search <SMOKE>", () => {
  beforeEach(() => {
    renewalsGrid.navigate()
  });

  it("Searches by Agreement number", () => {
    renewalsGrid.waitForPageLoading();
    cy.get(".cmp-renewal-search").first().click();
    cy.log("Start Searching!");
    cy.get(renewalsGrid.btnSearch)
      .should("be.visible")
      .each(($el) => {
        if ($el.text() === "Agreement Nº") {
          cy.wrap($el).click();
        }
      });
    cy.get(".cmp-renewal-search .inputStyle").type("356674944\n");
    cy.get(renewalsGrid.listAgreementNumber).should('have.text', '356674944')
  });

  it("Searches by End user name", () => {
    renewalsGrid.waitForPageLoading();
    cy.get(".cmp-renewal-search").first().click();
    cy.log("Start Searching!");
    cy.get(renewalsGrid.btnSearch)
      .should("be.visible")
      .each(($el) => {
        if ($el.text() === "End-User Name") {
          cy.wrap($el).click();
        }
      });
    cy.get(".cmp-renewal-search .inputStyle").type("CT Holdings\n");
    cy.get(renewalsGrid.listEndUser).should('have.text', 'CT Holdings')
  });
});
