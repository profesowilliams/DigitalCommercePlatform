/// <reference types="cypress" />
import { RenewalsGrid } from '../page_objects/renewals_page';
const renewalsGrid = new RenewalsGrid()
let totalNumber
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

  it("From and to change accordingly", () => {
    renewalsGrid.waitForPageLoading();
    cy.get(renewalsGrid.indexFromNumber).should('have.text', '1')
    cy.get(renewalsGrid.indexToNumber).should('have.text', '25')
    cy.get(renewalsGrid.indexTotalNumber).then(($total) => {
      totalNumber = $total.text()
      cy.get(renewalsGrid.btnRightPageArrow).click()
      cy.get(renewalsGrid.indexTotalNumber).should('have.text', totalNumber)
    })
    cy.get(renewalsGrid.indexFromNumber).should('have.text', '26')
    cy.get(renewalsGrid.indexToNumber).should('have.text', '50')
  })

  it("From and to change accordingly bottom", () => {
    renewalsGrid.waitForPageLoading();
    cy.get(renewalsGrid.indexFromNumberBottom).should('have.text', '1')
    cy.get(renewalsGrid.indexToNumberBottom).should('have.text', '25')
    cy.get(renewalsGrid.indexTotalNumberBottom).then(($total) => {
      totalNumber = $total.text()
      cy.get(renewalsGrid.btnRightPageArrow).click()
      cy.get(renewalsGrid.indexTotalNumberBottom).should('have.text', totalNumber)
    })
    cy.get(renewalsGrid.indexFromNumberBottom).should('have.text', '26')
    cy.get(renewalsGrid.indexToNumberBottom).should('have.text', '50')
  })
});
