export class RenewalsGrid {
  URL = 'http://localhost:8080/renewals-grid.html'
  btnSearch = '.cmp-renewal-search .cmp-search-select-container > .cmp-search-options > label'
  btnRightPageArrow = 'svg.fa-chevron-right'
  inputPageNumber = '.cmp-navigation__actions-labels > input'
  btnEndUser = 'div[aria-colindex="1"] .ag-header-cell-label'
  listEndUser = 'div[aria-colindex="1"].ag-cell-value'
  btnVendorAndProgram = 'div[aria-colindex="2"] .ag-header-cell-label'
  listVendorAndProgram = 'div[aria-colindex="2"].ag-cell-value'
  btnAgreementNumber = 'div[aria-colindex="3"] .ag-header-cell-label'
  listAgreementNumber = 'div[aria-colindex="3"].ag-cell-value'
  btnRenewalsPlan = 'div[aria-colindex="4"] .ag-header-cell-label'
  listRenewalsPlan = 'div[aria-colindex="4"].ag-cell-value'
  btnDueInDays = 'div[aria-colindex="5"] .ag-header-cell-label'
  listDueInDays = 'div[aria-colindex="5"].ag-cell-value'
  btnDueDate = 'div[aria-colindex="6"] .ag-header-cell-label'
  listDueDate = 'div[aria-colindex="6"].ag-cell-value'
  btnPrice = 'div[aria-colindex="7"] .ag-header-cell-label'
  listPrice = 'div[aria-colindex="7"].ag-cell-value'

  navigate() {
    cy.on("uncaught:exception", (err) => {
      return false;
    });
    cy.visit(this.URL);
  }

  clickSortColumn(variableName) {
    cy.get(variableName).click()
  }

  waitForPageLoading() {
    cy.get('[data-component="RenewalsGrid"]')
      .should("be.visible")
      .contains("here to set column");
  }

  getCellTextAsArray(locator) {
    let cellContents = [];
    return new Cypress.Promise(resolve => {
      cy.get(locator)
        .children()
        .each(($el) => {
          cellContents.push($el.text().toLowerCase());
        })
        .then(() => resolve(cellContents));
    });
  }

  getCellNumberAsArray(locator) {
    let cellContents = [];
    return new Cypress.Promise(resolve => {
      cy.get(locator)
        .children()
        .each(($el) => {
          cellContents.push(parseFloat($el.text().replace(',','')));
        })
        .then(() => resolve(cellContents));
    });
  }

  getCellDateAsArray(locator) {
    let cellContents = [];
    return new Cypress.Promise(resolve => {
      cy.get(locator)
        .children()
        .each(($el) => {
          const [month, day, year] = $el.text().split('/');
          const date = parseInt(year + month + day);
          cellContents.push(date);
        })
        .then(() => resolve(cellContents));
    });
  }
}