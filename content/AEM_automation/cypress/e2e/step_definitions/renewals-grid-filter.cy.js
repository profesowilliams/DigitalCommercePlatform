/// <reference types="cypress" />
import { RenewalsGrid } from '../page_objects/renewals_page';
const renewalsGrid = new RenewalsGrid()

describe("Test Filter <SMOKE>", () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  beforeEach(() => {
    renewalsGrid.navigate()
  });

  it("Filters by Vendors and Program", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accVendor).click()
    cy.get(renewalsGrid.checkBoxVmware).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', 'VMWARE ')
    cy.get(renewalsGrid.getFilterPill(3)).should('have.text', 'Standard ')
    cy.get(renewalsGrid.btnShowResult).click()
    renewalsGrid.getCellTextAsArray(renewalsGrid.listVendorAndProgram).then(cellContents => {
      for(let i = 0; i < cellContents.length; i++){
        expect(cellContents[i]).to.eq('vmware : standard')
      }
    });
  });

  it("Filters by End user Type Academic", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accEndUser).click()
    cy.get(renewalsGrid.checkBoxAcademic).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', 'Academic ')
    cy.get(renewalsGrid.btnShowResult).click()
    // PENDING: With current state its not possible to fully test the results shown
  });

  it("Filters by End user Type Commercial", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accEndUser).click()
    cy.get(renewalsGrid.checkBoxCommercial).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', 'Commercial ')
    cy.get(renewalsGrid.btnShowResult).click()
    // PENDING: With current state its not possible to fully test the results shown
  });

  it("Filters by Renewal plan", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accRenewalType).click()
    cy.get(renewalsGrid.checkBoxRenewal).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', 'Renewal ')
    cy.get(renewalsGrid.btnShowResult).click()
    renewalsGrid.getCellTextAsArray(renewalsGrid.listRenewalsPlan).then(cellContents => {
      for(let i = 0; i < cellContents.length; i++){
        expect(cellContents[i]).toHaveTextContent('Renewal')
      }
    });
  });

  it("Filters by Date Overdue", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accDate).click()
    cy.get(renewalsGrid.radioOverdue).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', 'Overdue ')
    cy.get(renewalsGrid.btnShowResult).click()
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listDueInDays).then(cellContents => {
      for(let i = 0; i < cellContents.length; i++){
        expect(cellContents[i]).to.be.below(0)
      }
    });
  });

  it("Filters by Date Today", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accDate).click()
    cy.get(renewalsGrid.radioToday).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', 'Today ')
    cy.get(renewalsGrid.btnShowResult).click()
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listDueInDays).then(cellContents => {
      for(let i = 0; i < cellContents.length; i++){
        expect(cellContents[i]).to.eq(0)
      }
    });
  });

  it("Filters by Date 0 - 30", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accDate).click()
    cy.get(renewalsGrid.radioZeroToThirty).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', '0 - 30 days ')
    cy.get(renewalsGrid.btnShowResult).click()
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listDueInDays).then(cellContents => {
      for(let i = 0; i < cellContents.length; i++){
        expect(cellContents[i]).to.be.above(0)
        expect(cellContents[i]).to.be.below(31)
      }
    });
  });

  it("Filters by Date 31 - 60", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accDate).click()
    cy.get(renewalsGrid.radioThirtyToSixty).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', '31 - 60 days ')
    cy.get(renewalsGrid.btnShowResult).click()
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listDueInDays).then(cellContents => {
      for(let i = 0; i < cellContents.length; i++){
        expect(cellContents[i]).to.be.above(30)
        expect(cellContents[i]).to.be.below(61)
      }
    });
  });

  it("Filters by Date 61 - 90", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accDate).click()
    cy.get(renewalsGrid.radioSixtyToNinety).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', '61 - 90 days ')
    cy.get(renewalsGrid.btnShowResult).click()
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listDueInDays).then(cellContents => {
      for(let i = 0; i < cellContents.length; i++){
        expect(cellContents[i]).to.be.above(60)
        expect(cellContents[i]).to.be.below(91)
      }
    });
  });

  it("Filters by Date 91+", () => {
    renewalsGrid.waitForPageLoading();
    cy.wait(1000)
    cy.get(renewalsGrid.btnFilter).click()
    cy.get(renewalsGrid.accDate).click()
    cy.get(renewalsGrid.radioNinetyPlus).click()
    cy.get(renewalsGrid.getFilterPill(2)).should('have.text', '91+ days ')
    cy.get(renewalsGrid.btnShowResult).click()
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listDueInDays).then(cellContents => {
      for(let i = 0; i < cellContents.length; i++){
        expect(cellContents[i]).to.be.above(90)
      }
    });
  });
});
