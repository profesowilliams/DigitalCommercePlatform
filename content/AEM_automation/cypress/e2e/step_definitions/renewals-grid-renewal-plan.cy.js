/// <reference types="cypress" />
import { RenewalsGrid } from '../page_objects/renewals_page';
const renewalsGrid = new RenewalsGrid()

describe("Verify renewals plan <SMOKE>", () => {
  beforeEach(() => {
    renewalsGrid.navigate();
  });

  it("Renewals plans are displayed", () => {
    renewalsGrid.waitForPageLoading();
    cy.get(renewalsGrid.btnRenewalPlanArrow).first().click()
    cy.get(renewalsGrid.lblRenewalPlanLeft).invoke('text').should('contain', "1 Year")
    cy.get(renewalsGrid.lblRenewalPlanPriceLeft).invoke('text').should('contain', '$')
    cy.get(renewalsGrid.lblQuoteIDLeft).invoke('text').should('contain', 'Quote ID:')
    cy.get(renewalsGrid.lblRefNoLeft).invoke('text').should('contain', 'Ref No:')
    cy.get(renewalsGrid.lblExpiryDateLeft).invoke('text').should('contain', 'Expiry Date:')
    cy.get(renewalsGrid.lblRenewalPlanRight).invoke('text').should('contain', "3 Years")
    cy.get(renewalsGrid.lblRenewalPlanPriceRight).invoke('text').should('contain', '$')
    cy.get(renewalsGrid.lblQuoteIDRight).invoke('text').should('contain', 'Quote ID:')
    cy.get(renewalsGrid.lblRefNoRight).invoke('text').should('contain', 'Ref No:')
    cy.get(renewalsGrid.lblExpiryDateRight).invoke('text').should('contain', 'Expiry Date:')
  });
});