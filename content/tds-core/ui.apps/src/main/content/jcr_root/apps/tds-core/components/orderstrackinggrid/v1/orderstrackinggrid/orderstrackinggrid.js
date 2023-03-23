"use strict";
use(["../common/utils.js"], function (utils) {
  let jsonObject = {};
  let resourceResolver = resource.getResourceResolver();
  let optionData = {};
  var productGrid = {};
  let icons = {};
  let noResultsValues = {};
  let dNotesFlyout = {};
  let invoicesFlyout = {};

  if (properties && properties["detailUrl"]) {
    jsonObject["detailUrl"] = properties["detailUrl"];
  }
  if (properties && properties["displayCurrencyName"]) {
    jsonObject["displayCurrencyName"] = properties["displayCurrencyName"];
  }

  //Column definition

  let columnListValues = utils.getDataFromMultifield(
    resourceResolver,
    "columnList",
    function (childResource) {
      let itemData = {};

      itemData.columnLabel = childResource.properties["columnLabel"];
      itemData.columnKey = childResource.properties["columnKey"];
      itemData.sortable = childResource.properties["sortable"];
      itemData.type = childResource.properties["columnType"];

      return itemData;
    }
  );

  if (columnListValues != null) {
    jsonObject["columnList"] = columnListValues;
  }

  //Multiple translation

  if (properties && properties["multiple"]) {
    jsonObject["multiple"] = properties["multiple"];
  }

  //Invoices flyout options

  if (properties && properties["invoicesFlyoutTitle"]) {
    invoicesFlyout.title = properties["invoicesFlyoutTitle"];
  }

  if (properties && properties["invoicesFlyoutDescription"]) {
    invoicesFlyout.description = properties["invoicesFlyoutDescription"];
  }

  if (properties && properties["invoicesFlyoutOrderNo"]) {
    invoicesFlyout.orderNo = properties["invoicesFlyoutOrderNo"];
  }

  if (properties && properties["invoicesFlyoutButton"]) {
    invoicesFlyout.button = properties["invoicesFlyoutButton"];
  }

  if (invoicesFlyout != null) {
    jsonObject["invoicesFlyout"] = invoicesFlyout;
  }

  //D-notes flyout options

  if (properties && properties["dNotesFlyoutTitle"]) {
    dNotesFlyout.title = properties["dNotesFlyoutTitle"];
  }

  if (properties && properties["dNotesFlyoutDescription"]) {
    dNotesFlyout.description = properties["dNotesFlyoutDescription"];
  }

  if (properties && properties["dNotesFlyoutOrderNo"]) {
    dNotesFlyout.orderNo = properties["dNotesFlyoutOrderNo"];
  }

  if (properties && properties["dNotesFlyoutButton"]) {
    dNotesFlyout.button = properties["dNotesFlyoutButton"];
  }

  if (dNotesFlyout != null) {
    jsonObject["dNotesFlyout"] = dNotesFlyout;
  }

  //Report options

  let reportOptionsValues = utils.getDataFromMultifield(
    resourceResolver,
    "reportOptions",
    function (childResource) {
      let itemData = {};

      itemData.label = childResource.properties["label"];
      itemData.key = childResource.properties["key"];

      return itemData;
    }
  );

  if (reportOptionsValues != null) {
    jsonObject["reportOptions"] = reportOptionsValues;
  }

  if (properties && properties['reportFilterKey']) {
    jsonObject['reportFilterKey'] = properties['reportFilterKey'];
  }

  if (properties && properties['pillLabel']) {
    jsonObject['pillLabel'] = properties['pillLabel'];
  }

  let dateOptionValues = utils.getDataFromMultifield(
    resourceResolver,
    "dateOptionsList",
    function (childResource) {
      let itemData = {};
      itemData.label = childResource.properties["label"];
      itemData.field = childResource.properties["field"];
      return itemData;
    }
  );
    
  if (dateOptionValues != null) {
    jsonObject["dateOptionValues"] = dateOptionValues;
  }

  //Search Options
  let searchOptionsValues = utils.getDataFromMultifield(
    resourceResolver,
    "searchOptionsList",
    function (childResource) {
      let itemData = {};
      itemData.searchLabel = childResource.properties["searchLabel"];
      itemData.searchKey = childResource.properties["searchKey"];
      itemData.showIfIsHouseAccount =
        childResource.properties["showIfIsHouseAccount"];
      return itemData;
    }
  );

  if (searchOptionsValues != null) {
    jsonObject["searchOptionsList"] = searchOptionsValues;
  }

  jsonObject["uiServiceEndPoint"] =
    this.serviceData.uiServiceDomain + this.serviceData.orderGridEndpoint || "";

  if (this.uiServiceDomain && this.downloadAllInvoicesEndpoint) {
    jsonObject["downloadAllInvoicesEndpoint"] =
      this.uiServiceDomain + this.downloadAllInvoicesEndpoint;
  }

  if (this.agGridLicenseKey) {
    jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
  }
  if (properties && properties["itemsPerPage"]) {
    jsonObject["itemsPerPage"] = properties["itemsPerPage"];
  }
  if (properties && properties["shopPath"] && this.shopDomainPage) {
    jsonObject["shopURL"] = this.shopDomainPage + properties["shopPath"];
  }
  if (properties && properties["paginationStyle"]) {
    jsonObject["paginationStyle"] = properties["paginationStyle"];
  }
  if (properties && properties["defaultSortingColumnKey"]) {
    optionData.defaultSortingColumnKey = properties["defaultSortingColumnKey"];
  }
  if (properties && properties["defaultSortingDirection"]) {
    optionData.defaultSortingDirection = properties["defaultSortingDirection"];
  }

  if (optionData != null) {
    jsonObject["options"] = optionData;
  }

  if (properties && properties["filterTitle"]) {
    jsonObject["filterTitle"] = properties["filterTitle"];
  }

  if (properties && properties["clearAllFilterTitle"]) {
    jsonObject["clearAllFilterTitle"] = properties["clearAllFilterTitle"];
  }

  if (properties && properties["showResultLabel"]) {
    jsonObject["showResultLabel"] = properties["showResultLabel"];
  }

  if (properties && properties["menuCopy"]) {
    jsonObject["menuCopy"] = properties["menuCopy"];
  }

  if (properties && properties["menuCopyWithHeaders"]) {
    jsonObject["menuCopyWithHeaders"] = properties["menuCopyWithHeaders"];
  }

  if (properties && properties["menuExport"]) {
    jsonObject["menuExport"] = properties["menuExport"];
  }

  if (properties && properties["menuCsvExport"]) {
    jsonObject["menuCsvExport"] = properties["menuCsvExport"];
  }

  if (properties && properties["menuExcelExport"]) {
    jsonObject["menuExcelExport"] = properties["menuExcelExport"];
  }

  if (properties && properties["menuOpenLink"]) {
    jsonObject["menuOpenLink"] = properties["menuOpenLink"];
  }

  if (properties && properties["menuCopyLink"]) {
    jsonObject["menuCopyLink"] = properties["menuCopyLink"];
  }

  if (properties && properties["ofTextLabel"]) {
    jsonObject["ofTextLabel"] = properties["ofTextLabel"];
  }

  if (properties && properties["filterType"]) {
    jsonObject["filterType"] = properties["filterType"];
  }

  if (properties && properties["defaultSearchDateRange"]) {
    jsonObject["defaultSearchDateRange"] = properties["defaultSearchDateRange"];
  }

  let node = resourceResolver.getResource(
    currentNode.getPath() + "/filterList"
  );
  let filterListValues = [];
  if (node !== null) {
    let childrenList = node.getChildren();
    for (let [key, res] in Iterator(childrenList)) {
      let accordionLabel = res.properties["accordionLabel"];
      let filterField = res.properties["filterField"];
      let itemData = {};
      itemData.accordionLabel = accordionLabel;
      itemData.filterField = filterField;
      let childNode = resourceResolver.getResource(
        res.getPath() + "/filtersOptionsList"
      );

      if (childNode != null) {
        itemData.filterOptionsValues = [];
        let childNodeList = childNode.getChildren();
        for (let [childkey, childRes] in Iterator(childNodeList)) {
          let childDataItem = {};
          let filterOptionLabel = childRes.properties["filterOptionLabel"];
          childDataItem.filterOptionLabel = filterOptionLabel;
          let subChildNode = resourceResolver.getResource(
            childRes.getPath() + "/subFilterOptionList"
          );

          if (subChildNode != null) {
            let subFilterOptionsValues = [];
            let subChildNodeList = subChildNode.getChildren();

            for (let [subChildKey, subChildRes] in Iterator(subChildNodeList)) {
              let subChildDataItem = {};
              subChildDataItem.subFilterOptionsLabel =
                subChildRes.properties["subFilterOptionsLabel"];
              subFilterOptionsValues.push(subChildDataItem);
            }
            childDataItem.subFilterOptionsValues = subFilterOptionsValues;
          }
          itemData.filterOptionsValues.push(childDataItem);
        }
      }
      filterListValues.push(itemData);
    }
  }

  if (filterListValues != null) {
    jsonObject["filterListValues"] = filterListValues;
  }

  if (properties && properties["quoteIdLabel"]) {
    productGrid["quoteIdLabel"] = properties["quoteIdLabel"];
  }

  if (properties && properties["refNoLabel"]) {
    productGrid["refNoLabel"] = properties["refNoLabel"];
  }

  if (properties && properties["expiryDateLabel"]) {
    productGrid["expiryDateLabel"] = properties["expiryDateLabel"];
  }

  if (properties && properties["downloadPDFLabel"]) {
    productGrid["downloadPDFLabel"] = properties["downloadPDFLabel"];
  }

  if (properties && properties["downloadXLSLabel"]) {
    productGrid["downloadXLSLabel"] = properties["downloadXLSLabel"];
  }

  if (properties && properties["showDownloadPDFButton"]) {
    productGrid["showDownloadPDFButton"] = properties["showDownloadPDFButton"];
  }

  if (properties && properties["showDownloadXLSButton"]) {
    productGrid["showDownloadXLSButton"] = properties["showDownloadXLSButton"];
  }

  if (properties && properties["showDownloadXLSButton"]) {
    productGrid["showDownloadXLSButton"] = properties["showDownloadXLSButton"];
  }

  if (properties && properties["showSeeDetailsButton"]) {
    productGrid["showSeeDetailsButton"] = properties["showSeeDetailsButton"];
  }

  if (properties && properties["seeDetailsLabel"]) {
    productGrid["seeDetailsLabel"] = properties["seeDetailsLabel"];
  }

  if (productGrid != null) {
    jsonObject["productGrid"] = productGrid;
  }

  const overdueProperties = {
    values: ["overdueIcon", "overdueIconColor"],
    propertyName: "overdueDaysRange",
  };
  const thirtyDaysProperties = {
    values: ["afterZeroIcon", "afterZeroIconColor"],
    propertyName: "afterZeroDaysRange",
  };
  const sixtyOneDaysProperties = {
    values: ["afterThirtyIcon", "afterThirtyIconColor"],
    propertyName: "afterThirtyDaysRange",
  };
  const sixtyOnePlusProperties = {
    values: ["sixtyPlusIcon", "sixtyPlusIconColor"],
    propertyName: "sixtyPlusDaysRange",
  };

  function populateOutterProperty(obj, prop) {
    const populated = utils.fillFieldsDialogProperties(prop.values);
    const daysPropertyName = properties[prop.propertyName];
    if (populated && daysPropertyName) {
      obj[daysPropertyName] = populated;
    }
  }

  if (properties) {
    populateOutterProperty(icons, overdueProperties);
    populateOutterProperty(icons, thirtyDaysProperties);
    populateOutterProperty(icons, sixtyOneDaysProperties);
    populateOutterProperty(icons, sixtyOnePlusProperties);
  }

  if (!!icons) {
    jsonObject["icons"] = icons;
  }

  if (properties && properties["hideCopyHeaderOption"]) {
    jsonObject["hideCopyHeaderOption"] = properties["hideCopyHeaderOption"];
  }

  if (properties && properties["hideExportOption"]) {
    jsonObject["hideExportOption"] = properties["hideExportOption"];
  }

  if (properties && properties["noResultsTitle"]) {
    noResultsValues.noResultsTitle = properties["noResultsTitle"];
  }

  if (properties && properties["noResultsDescription"]) {
    noResultsValues.noResultsDescription = properties["noResultsDescription"];
  }

  if (properties && properties["noResultsImageFileReference"]) {
    noResultsValues.noResultsImage = properties["noResultsImageFileReference"];
  }

  if (properties && properties["noDataTitle"]) {
    noResultsValues.noDataTitle = properties["noDataTitle"];
  }

  if (properties && properties["noDataDescription"]) {
    noResultsValues.noDataDescription = properties["noDataDescription"];
  }

  if (properties && properties["noDataImageFileReference"]) {
    noResultsValues.noDataImage = properties["noDataImageFileReference"];
  }

  if (noResultsValues != null) {
    jsonObject["searchResultsError"] = noResultsValues;
  }

  return {
    configJson: JSON.stringify(jsonObject),
  };
});
