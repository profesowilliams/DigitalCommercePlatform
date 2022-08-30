/// <reference types="cypress" />
import { RenewalsGrid } from '../page_objects/renewals_page';
const renewalsGrid = new RenewalsGrid()

describe("Verify three dots <SMOKE>", () => {
  beforeEach(() => {
    renewalsGrid.navigate();
  });

  it("Three dots actions are displayed", () => {
    renewalsGrid.waitForPageLoading();
    cy.get(renewalsGrid.btnThreeDots).first().click()
    cy.get(renewalsGrid.btnpdf).should('have.text', 'Download PDF')
    cy.get(renewalsGrid.btnxls).should('have.text', 'Download XLS')
    cy.get(renewalsGrid.btndetails).should('have.text', 'See details')
  });
});