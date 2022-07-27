/// <reference types="cypress" />
import { RenewalsGrid } from '../page_objects/renewals_page';
const renewalsGrid = new RenewalsGrid()

describe("Test sorting <SMOKE>", () => {
  beforeEach(() => {
    renewalsGrid.navigate();
  });

  it("sorts End User Name", () => {
    renewalsGrid.waitForPageLoading();
    renewalsGrid.clickSortColumn(renewalsGrid.btnEndUser);
    cy.log("sorts ascending");
    renewalsGrid.getCellTextAsArray(renewalsGrid.listEndUser).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort());
    });
    renewalsGrid.clickSortColumn(renewalsGrid.btnEndUser);
    cy.log("sorts descending");
    renewalsGrid.getCellTextAsArray(renewalsGrid.listEndUser).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort().reverse());
    });
  });

  it("sorts Vendor and Program", () => {
    renewalsGrid.waitForPageLoading();
    renewalsGrid.clickSortColumn(renewalsGrid.btnVendorAndProgram);
    cy.log("sorts ascending");
    renewalsGrid.getCellTextAsArray(renewalsGrid.listVendorAndProgram).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort());
    });
    renewalsGrid.clickSortColumn(renewalsGrid.btnVendorAndProgram);
    cy.log("sorts descending");
    renewalsGrid.getCellTextAsArray(renewalsGrid.listVendorAndProgram).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort().reverse());
    });
  })

  it("sorts Agreement Number", () => {
    renewalsGrid.waitForPageLoading();
    renewalsGrid.clickSortColumn(renewalsGrid.btnAgreementNumber);
    cy.log("sorts ascending");
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listAgreementNumber).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort());
    });
    renewalsGrid.clickSortColumn(renewalsGrid.btnAgreementNumber);
    cy.log("sorts descending");
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listAgreementNumber).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort().reverse());
    });
  })

  it("sorts Renewal Plan", () => {
    renewalsGrid.waitForPageLoading();
    renewalsGrid.clickSortColumn(renewalsGrid.btnRenewalsPlan);
    cy.log("sorts ascending");
    renewalsGrid.getCellTextAsArray(renewalsGrid.listRenewalsPlan).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort());
    });
    renewalsGrid.clickSortColumn(renewalsGrid.btnRenewalsPlan);
    cy.log("sorts descending");
    renewalsGrid.getCellTextAsArray(renewalsGrid.listRenewalsPlan).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort().reverse());
    });
  })

  it("sorts Due in Days", () => {
    renewalsGrid.waitForPageLoading();
    renewalsGrid.clickSortColumn(renewalsGrid.btnDueInDays);
    cy.log("sorts ascending");
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listDueInDays).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort(function(a, b){return a-b}));
    });
    renewalsGrid.clickSortColumn(renewalsGrid.btnDueInDays);
    cy.log("sorts descending");
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listDueInDays).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort(function(a, b){return b-a}));
    });
  })

  it("sorts Due Date", () => {
    renewalsGrid.waitForPageLoading();
    cy.log("sorts ascending");
    renewalsGrid.getCellDateAsArray(renewalsGrid.listDueDate).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort(function(a, b){return a-b}));
    });
    renewalsGrid.clickSortColumn(renewalsGrid.btnDueDate);
    cy.log("sorts descending");
    renewalsGrid.getCellDateAsArray(renewalsGrid.listDueDate).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort(function(a, b){return b-a}));
    });
  })

  it("sorts Price", () => {
    renewalsGrid.waitForPageLoading();
    renewalsGrid.clickSortColumn(renewalsGrid.btnPrice);
    cy.log("sorts ascending");
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listPrice).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort(function(a, b){return a-b}));
    });
    renewalsGrid.clickSortColumn(renewalsGrid.btnPrice);
    cy.log("sorts descending");
    renewalsGrid.getCellNumberAsArray(renewalsGrid.listPrice).then(cellContents => {
      let actual = cellContents.slice();
      cy.wrap(actual).should("deep.eq", cellContents.sort(function(a, b){return b-a}));
    }); 
  })
});