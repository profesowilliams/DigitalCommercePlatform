/// <reference types="cypress" />
import { RenewalsGrid } from '../page_objects/renewals_page';
const renewalsGrid = new RenewalsGrid()

describe("Test Navigation <SMOKE>", () => {
  beforeEach(() => {
    renewalsGrid.navigate()
  });

  it("Starts in page 1", () => {
    renewalsGrid.waitForPageLoading();
    cy.get(renewalsGrid.inputPageNumber).should('have.value','1')
  });

  it("Change page in an increment of 1", () => {
    renewalsGrid.waitForPageLoading();
    cy.get(renewalsGrid.inputPageNumber).should('have.value','1')
    cy.wait(500)
    cy.get(renewalsGrid.btnRightPageArrow).click()
    cy.get(renewalsGrid.inputPageNumber).should('have.value','2')
  })
});
