/** @format */

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
  let exportFlyout = {};
  let noAccessProps = {};
  let analyticsCategories = {};

  let filterLabels = {};

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

  //Export flyout options
  let exportOptionsList = utils.getDataFromMultifield(
    resourceResolver,
    "exportOptionsList",
    function (childResource) {
      let itemData = {};
      itemData.label = childResource.properties["label"];
      itemData.key = childResource.properties["key"];
      return itemData;
    }
  );

  if (exportOptionsList != null) {
    jsonObject["exportOptionsList"] = exportOptionsList;
  }

  let exportSecondaryOptionsList = utils.getDataFromMultifield(
    resourceResolver,
    "exportSecondaryOptionsList",
    function (childResource) {
      let itemData = {};
      itemData.label = childResource.properties["label"];
      itemData.key = childResource.properties["key"];
      return itemData;
    }
  );

  if (exportSecondaryOptionsList != null) {
    jsonObject["exportSecondaryOptionsList"] = exportSecondaryOptionsList;
  }

  if (properties && properties["exportFlyoutTitle"]) {
    exportFlyout.title = properties["exportFlyoutTitle"];
  }

  if (properties && properties["exportFlyoutDescription"]) {
    exportFlyout.description = properties["exportFlyoutDescription"];
  }
  if (properties && properties["exportFlyoutSecondaryDescription"]) {
    exportFlyout.secondaryDescription =
      properties["exportFlyoutSecondaryDescription"];
  }

  if (properties && properties["exportFlyoutButton"]) {
    exportFlyout.button = properties["exportFlyoutButton"];
  }

  if (properties && properties["exportSuccessMessage"]) {
    exportFlyout.exportSuccessMessage = properties["exportSuccessMessage"];
  }

  if (exportFlyout != null) {
    jsonObject["exportFlyout"] = exportFlyout;
  }

  //Invoices flyout options
  let invoicesColumnList = utils.getDataFromMultifield(
    resourceResolver,
    "invoicesColumnList",
    function (childResource) {
      let itemData = {};

      itemData.columnLabel = childResource.properties["columnLabel"];
      itemData.columnKey = childResource.properties["columnKey"];
      return itemData;
    }
  );

  if (invoicesColumnList != null) {
    jsonObject["invoicesColumnList"] = invoicesColumnList;
  }

  if (properties && properties["invoicesFlyoutTitle"]) {
    invoicesFlyout.title = properties["invoicesFlyoutTitle"];
  }

  if (properties && properties["invoicesFlyoutDescription"]) {
    invoicesFlyout.description = properties["invoicesFlyoutDescription"];
  }

  if (properties && properties["invoicesFlyoutOrderNo"]) {
    invoicesFlyout.orderNo = properties["invoicesFlyoutOrderNo"];
  }

  if (properties && properties["invoicesFlyoutPoNo"]) {
    invoicesFlyout.poNo = properties["invoicesFlyoutPoNo"];
  }

  if (properties && properties["invoicesFlyoutButton"]) {
    invoicesFlyout.button = properties["invoicesFlyoutButton"];
  }

  if (properties && properties["invoicesFlyoutClearAllButton"]) {
    invoicesFlyout.clearAllButton = properties["invoicesFlyoutClearAllButton"];
  }

  if (invoicesFlyout != null) {
    jsonObject["invoicesFlyout"] = invoicesFlyout;
  }

  //D-notes flyout options
  let dNoteColumnList = utils.getDataFromMultifield(
    resourceResolver,
    "dNoteColumnList",
    function (childResource) {
      let itemData = {};

      itemData.columnLabel = childResource.properties["columnLabel"];
      itemData.columnKey = childResource.properties["columnKey"];
      return itemData;
    }
  );

  if (dNoteColumnList != null) {
    jsonObject["dNoteColumnList"] = dNoteColumnList;
  }

  if (properties && properties["dNotesFlyoutTitle"]) {
    dNotesFlyout.title = properties["dNotesFlyoutTitle"];
  }

  if (properties && properties["dNotesFlyoutDescription"]) {
    dNotesFlyout.description = properties["dNotesFlyoutDescription"];
  }

  if (properties && properties["dNotesFlyoutOrderNo"]) {
    dNotesFlyout.orderNo = properties["dNotesFlyoutOrderNo"];
  }

  if (properties && properties["dNotesFlyoutPoNo"]) {
    dNotesFlyout.poNo = properties["dNotesFlyoutPoNo"];
  }

  if (properties && properties["dNotesFlyoutButton"]) {
    dNotesFlyout.button = properties["dNotesFlyoutButton"];
  }

  if (properties && properties["dNotesFlyoutClearAllButton"]) {
    dNotesFlyout.clearAllButton = properties["dNotesFlyoutClearAllButton"];
  }

  if (dNotesFlyout != null) {
    jsonObject["dNotesFlyout"] = dNotesFlyout;
  }

  if (properties && properties["reportPillLabel"]) {
    jsonObject["reportPillLabel"] = properties["reportPillLabel"];
  }
  // No Access Screen
  if (properties && properties["noAccessTitle"]) {
    noAccessProps.noAccessTitle = properties["noAccessTitle"];
  }
  if (properties && properties["noAccessMessage"]) {
    noAccessProps.noAccessMessage = properties["noAccessMessage"];
  }
  if (properties && properties["noAccessBack"]) {
    noAccessProps.noAccessBack = properties["noAccessBack"];
  }
  if (noAccessProps != null) {
    jsonObject["noAccessProps"] = noAccessProps;
  }

  // Analytics Categories
  if (properties && properties["sortAnalyticsCategories"]) {
    analyticsCategories.sort = properties["sortAnalyticsCategories"];
  }
  if (properties && properties["searchAnalyticsCategories"]) {
    analyticsCategories.search = properties["searchAnalyticsCategories"];
  }
  if (properties && properties["filterAnalyticsCategories"]) {
    analyticsCategories.filter = properties["filterAnalyticsCategories"];
  }
  if (properties && properties["exportAnalyticsCategories"]) {
    analyticsCategories.export = properties["exportAnalyticsCategories"];
  }
  if (properties && properties["reportAnalyticsCategories"]) {
    analyticsCategories.report = properties["reportAnalyticsCategories"];
  }
  if (properties && properties["paginationAnalyticsCategories"]) {
    analyticsCategories.pagination =
      properties["paginationAnalyticsCategories"];
  }
  if (analyticsCategories != null) {
    jsonObject["analyticsCategories"] = analyticsCategories;
  }


  if (properties && properties["reportPillLabel"]) {
    jsonObject["reportPillLabel"] = properties["reportPillLabel"];
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

  jsonObject["ordersCountEndpoint"] =
    this.serviceData.uiServiceDomain + this.serviceData.ordersCountEndpoint ||
    "";

  jsonObject["ordersReportEndpoint"] =
    this.serviceData.uiServiceDomain + this.serviceData.ordersReportEndpoint ||
    "";

  jsonObject["ordersReportCountEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.ordersReportCountEndpoint || "";

  jsonObject["ordersDownloadDocumentsEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.ordersDownloadDocumentsEndpoint || "";

  jsonObject["exportAllOrderLinesEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.exportAllOrderLinesEndpoint || "";

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

  //Filter Options

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
      let itemData = {};
      itemData.accordionLabel = res.properties["accordionLabel"];
      itemData.filterField = res.properties["filterField"];
      itemData.filterOptionsValues = [];
      let childNode = resourceResolver.getResource(
        res.getPath() + "/filterOptionsValues"
      );

      if (childNode != null) {
        let childNodeList = childNode.getChildren();
        for (let [childkey, childRes] in Iterator(childNodeList)) {
          itemData.filterOptionsValues.push({
            filterOptionLabel: childRes.properties["filterOptionLabel"],
            filterOptionKey: childRes.properties["filterOptionKey"],
          });
        }
      }
      filterListValues.push(itemData);
    }
  }

  if (filterListValues != null) {
    jsonObject["filterListValues"] = filterListValues;
  }

  if (properties && properties["dateRange"]) {
    filterLabels.dateRange = properties["dateRange"];
  }

  if (properties && properties["endLabel"]) {
    filterLabels.endLabel = properties["endLabel"];
  }

  if (properties && properties["startLabel"]) {
    filterLabels.startLabel = properties["startLabel"];
  }

  if (properties && properties["addDateLabel"]) {
    filterLabels.addDateLabel = properties["addDateLabel"];
  }
  if (properties && properties["filterTitle"]) {
    filterLabels.filterTitle = properties["filterTitle"];
  }
  if (properties && properties["filterType"]) {
    filterLabels.filterType = properties["filterType"];
  }

  if (properties && properties["showResultLabel"]) {
    filterLabels.showResultLabel = properties["showResultLabel"];
  }
  if (properties && properties["orderStatus"]) {
    filterLabels.orderStatus = properties["orderStatus"];
  }
  if (properties && properties["orderType"]) {
    filterLabels.orderType = properties["orderType"];
  }
  if (properties && properties["open"]) {
    filterLabels.open = properties["open"];
  }
  if (properties && properties["investigation"]) {
    filterLabels.investigation = properties["investigation"];
  }
  if (properties && properties["shipping"]) {
    filterLabels.shipping = properties["shipping"];
  }
  if (properties && properties["reject"]) {
    filterLabels.reject = properties["reject"];
  }
  if (properties && properties["complete"]) {
    filterLabels.complete = properties["complete"];
  }
  if (properties && properties["cancelled"]) {
    filterLabels.cancelled = properties["cancelled"];
  }
  if (properties && properties["onHold"]) {
    filterLabels.onHold = properties["onHold"];
  }
  if (properties && properties["shipped"]) {
    filterLabels.shipped = properties["shipped"];
  }
  if (properties && properties["inProcess"]) {
    filterLabels.inProcess = properties["inProcess"];
  }
  if (properties && properties["inTouch"]) {
    filterLabels.inTouch = properties["inTouch"];
  }
  if (properties && properties["ediOrXml"]) {
    filterLabels.ediOrXml = properties["ediOrXml"];
  }
  if (properties && properties["consignmentFillUp"]) {
    filterLabels.consignmentFillUp = properties["consignmentFillUp"];
  }
  if (properties && properties["license"]) {
    filterLabels.license = properties["license"];
  }
  if (properties && properties["tdmrsProject"]) {
    filterLabels.tdmrsProject = properties["tdmrsProject"];
  }
  if (properties && properties["manual"]) {
    filterLabels.manual = properties["manual"];
  }
  if (properties && properties["tdStaffPurchase"]) {
    filterLabels.tdStaffPurchase = properties["tdStaffPurchase"];
  }
  if (properties && properties["projectOrder"]) {
    filterLabels.projectOrder = properties["projectOrder"];
  }
  if (properties && properties["quotationLabel"]) {
    filterLabels.quotationLabel = properties["quotationLabel"];
  }
  if (properties && properties["thirdParty"]) {
    filterLabels.thirdParty = properties["thirdParty"];
  }
  if (properties && properties["licensing"]) {
    filterLabels.licensing = properties["licensing"];
  }
  if (properties && properties["stockingOrder"]) {
    filterLabels.stockingOrder = properties["stockingOrder"];
  }
  if (properties && properties["streamOne"]) {
    filterLabels.streamOne = properties["streamOne"];
  }

  if (filterLabels != null) {
    jsonObject["filterLabels"] = filterLabels;
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
