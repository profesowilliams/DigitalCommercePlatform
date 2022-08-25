export class RenewalsGrid {
  URL = 'http://localhost:8080/renewals-grid.html'
  btnSearch = '.cmp-renewal-search .cmp-search-select-container > .cmp-search-options > label'
  inputSearch = '.cmp-search-tooltip__button'
  btnRightPageArrow = '.cmp-renewals-subheader button.move-button svg.fa-chevron-right'
  inputPageNumber = '.cmp-navigation__actions-labels > input'
  indexFromNumber = '.cmp-renewals-subheader .navigation__info>.cta:nth-child(1)'
  indexToNumber = '.cmp-renewals-subheader .navigation__info>.cta:nth-child(2)'
  indexTotalNumber = '.cmp-renewals-subheader .navigation__info>.cta:nth-child(3)'
  indexFromNumberBottom = '.cmp-renewals__pagination--bottom .navigation__info>.cta:nth-child(1)'
  indexToNumberBottom = '.cmp-renewals__pagination--bottom .navigation__info>.cta:nth-child(2)'
  indexTotalNumberBottom = '.cmp-renewals__pagination--bottom .navigation__info>.cta:nth-child(3)'
  btnEndUser = 'div[aria-colindex="1"] .ag-header-cell-label'
  listEndUser = 'div[aria-colindex="1"].ag-cell-value'
  btnVendorAndProgram = 'div[aria-colindex="2"] .ag-header-cell-label'
  listVendorAndProgram = 'div[aria-colindex="2"].ag-cell-value'
  btnAgreementNumber = 'div[aria-colindex="4"] .ag-header-cell-label'
  listAgreementNumber = 'div[aria-colindex="4"].ag-cell-value'
  btnRenewalsPlan = 'div[aria-colindex="5"] .ag-header-cell-label'
  listRenewalsPlan = 'div[aria-colindex="5"].ag-cell-value'
  btnDueInDays = 'div[aria-colindex="6"] .ag-header-cell-label'
  listDueInDays = 'div[aria-colindex="6"].ag-cell-value'
  btnDueDate = 'div[aria-colindex="7"] .ag-header-cell-label'
  listDueDate = 'div[aria-colindex="7"].ag-cell-value'
  btnPrice = 'div[aria-colindex="8"] .ag-header-cell-label'
  listPrice = 'div[aria-colindex="8"].ag-cell-value'
  btnFilter = '.cmp-renewals-filter__button'
  accVendor = '.filter-accordion__item:nth-child(1)'
  accEndUser = '.filter-accordion__item:nth-child(3)'
  accRenewalType = '.filter-accordion__item:nth-child(5)'
  accDate = '.filter-accordion__item:nth-child(7)'
  checkBoxVmware = 'input[name="VMWARE"]'
  checkBoxAcademic = 'input[name="Academic"]'
  checkBoxCommercial = 'input[name="Commercial"]'
  checkBoxRenewal = 'input[name="Renewal"]'
  radioOverdue = 'input[id="0"]'
  radioToday = 'input[id="1"]'
  radioZeroToThirty = 'input[id="2"]'
  radioThirtyToSixty = 'input[id="3"]'
  radioSixtyToNinety = 'input[id="4"]'
  radioNinetyPlus = 'input[id="5"]'
  btnShowResult = '.filter-modal-container__results'
  msgNoRows = '.customErrorNoRows'


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

  getFilterPill(number) {
    let locator = '.filter-tags:nth-child(x)'.replace('x', number);
    return locator;
  }
}