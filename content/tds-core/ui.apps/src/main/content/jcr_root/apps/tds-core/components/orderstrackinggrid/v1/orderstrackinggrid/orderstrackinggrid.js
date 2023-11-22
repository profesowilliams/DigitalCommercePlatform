/** @format */

"use strict";
use(["../common/utils.js"], function (utils) {
  const jsonObject = {};
  const resourceResolver = resource.getResourceResolver();
  const optionData = {};
  const productGrid = {};
  const icons = {};
  const noResultsValues = {};
  const dNotesFlyout = {};
  const reportLabels = {};
  const orderLineDetailsShippedColumnLabels = {};
  const orderLineDetailsNotShippedColumnLabels = {};
  const orderModifyLabels = {};
  const invoicesFlyout = {};
  const exportFlyout = {};
  const orderLineDetails = {};
  const noAccessProps = {};
  const analyticsCategories = {};
  const paginationLabels = {};
  const searchLabels = {};
  const filterLabels = {};

  if (properties) {
    const labelsList = [
      "detailUrl",
      "displayCurrencyName",
      "multiple",
      "menuCopy",
      "menuCopyWithHeaders",
      "menuExport",
      "menuCsvExport",
      "menuExcelExport",
      "menuOpenLink",
      "menuCopyLink",
      "ofTextLabel",
    ];

    labelsList.map((property) => {
      if (properties[property]) {
        jsonObject[property] = properties[property];
      }
    });

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

    const exportFlyoutLabels = [
      { key: "title", name: "exportFlyoutTitle" },
      { key: "description", name: "exportFlyoutDescription" },
      { key: "secondaryDescription", name: "exportFlyoutSecondaryDescription" },
      { key: "button", name: "exportFlyoutButton" },
      { key: "exportSuccessMessage", name: "exportSuccessMessage" },
      { key: "exportFailedMessage", name: "exportFailedMessage" }
    ];

    exportFlyoutLabels.map((label) => {
      exportFlyout[label.key] = properties[label.name];
    });

    if (exportFlyout != null) {
      jsonObject["exportFlyout"] = exportFlyout;
    }

    // Order Details Tab
    const orderLineDetailsLabels = [
      "shippedLabel",
      "notShippedLabel",
      "itemsLabel",
      "trackLabel",
      "modifyEligibleItemsLabel",
    ];

    orderLineDetailsLabels.map((label) => {
      orderLineDetails[label] = properties[label];
    });

    if (orderLineDetails != null) {
      jsonObject["orderLineDetails"] = orderLineDetails;
    }

    // Shipped Grid
    const orderLineDetailsShippedLabels = [
      "dropdownArrow",
      "shipDate",
      "dnote",
      "invoice",
      "value",
      "qty",
      "track",
    ];

    orderLineDetailsShippedLabels.map((label) => {
      orderLineDetailsShippedColumnLabels[label] = properties[label];
    });
    if (orderLineDetailsShippedColumnLabels != null) {
      jsonObject["orderLineDetailsShippedColumnLabels"] =
        orderLineDetailsShippedColumnLabels;
    }
    // Not Shipped Grid
    const orderLineDetailsNotShippedLabels = [
      "lineNumber",
      "item",
      "pnsku",
      "nqty",
      "deliveryEstimate",
    ];

    orderLineDetailsNotShippedLabels.map((label) => {
      orderLineDetailsNotShippedColumnLabels[label] = properties[label];
    });
    if (orderLineDetailsNotShippedColumnLabels != null) {
      jsonObject["orderLineDetailsNotShippedColumnLabels"] =
        orderLineDetailsNotShippedColumnLabels;
    }

    // OrderModifyLabels
    const orderModifyLabelsList = [
      "addNewItem",
      "editQuantities",
      "lineTotal",
      "modifyOrder",
      "cancel",
      "update",
      "manufacturersPartNumber",
      "quantity",
      "add",
      "lineMfgPartNo",
      "additionalQuantityAdded",
      "selectReasonLabel",
      "rejectionPrice",
      "rejectionAvailability",
      "rejectionOther",
      "rejectionRequiredInfo",
      "completeDeliveryOnly",
      "cancelNewItem",
    ];

    orderModifyLabelsList.map((property) => {
      orderModifyLabels[property] = properties[property];
    });

    if (orderModifyLabels != null) {
      jsonObject["orderModifyLabels"] = orderModifyLabels;
    }

    jsonObject["uiServiceEndPoint"] =
      this.serviceData.uiServiceDomain + this.serviceData.orderGridEndpoint ||
      "";

    jsonObject["uiCommerceServiceDomain"] = this.serviceData.uiServiceDomain + `/ui-commerce`;
    const endpoints = [
      "orderModifyEndpoint",
      "orderModifyChangeEndpoint",
      "uiServiceEndPointForDetails",
      "ordersReportEndpoint",
      "ordersReportCountEndpoint",
      "ordersDownloadDocumentsEndpoint",
      "exportAllOrderLinesEndpoint",
      "exportLinesWithSerialNumbersOnlyEndpoint",
      "downloadAllInvoicesEndpoint"
    ];

    endpoints.map((endpoint) => {
      jsonObject[endpoint] =
        this.serviceData.uiServiceDomain + this.serviceData[endpoint] || "";
    });

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

    const invoicesLabelsList = [
      { key: "title", name: "invoicesFlyoutTitle" },
      { key: "description", name: "invoicesFlyoutDescription" },
      { key: "orderNo", name: "invoicesFlyoutOrderNo" },
      { key: "poNo", name: "invoicesFlyoutPoNo" },
      { key: "button", name: "invoicesFlyoutButton" },
      { key: "clearAllButton", name: "invoicesFlyoutClearAllButton" },
    ];

    invoicesLabelsList.map((label) => {
      invoicesFlyout[label.key] = properties[label.name];
    });

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

    const dnotesLabelsList = [
      { key: "title", name: "dNotesFlyoutTitle" },
      { key: "description", name: "dNotesFlyoutDescription" },
      { key: "orderNo", name: "dNotesFlyoutOrderNo" },
      { key: "poNo", name: "dNotesFlyoutPoNo" },
      { key: "button", name: "dNotesFlyoutButton" },
      { key: "clearAllButton", name: "dNotesFlyoutClearAllButton" },
    ];

    dnotesLabelsList.map((label) => {
      dNotesFlyout[label.key] = properties[label.name];
    });

    if (dNotesFlyout != null) {
      jsonObject["dNotesFlyout"] = dNotesFlyout;
    }

    // Reports
    const reportLabelsList = [
      "openOrdersLabel",
      "newBacklogLabel",
      "eolReportLabel",
      "todaysShipmentsDeliveriesLabel",
      "last7DaysOrdersLabel",
      "last30DaysOrdersLabel",
      "last7DaysShipmentsLabel",
      "last30DaysShipmentsLabel",
    ];

    reportLabelsList.map((label) => {
      reportLabels[label] = properties[label];
    });

    if (reportLabels != null) {
      jsonObject["reportLabels"] = reportLabels;
    }

    if (properties["reportPillLabel"]) {
      jsonObject["reportPillLabel"] = properties["reportPillLabel"];
    }

    // No Access Screen
    if (properties["noAccessTitle"]) {
      noAccessProps.noAccessTitle = properties["noAccessTitle"];
    }
    if (properties["noAccessMessage"]) {
      noAccessProps.noAccessMessage = properties["noAccessMessage"];
    }
    if (properties["noAccessBack"]) {
      noAccessProps.noAccessBack = properties["noAccessBack"];
    }
    if (noAccessProps != null) {
      jsonObject["noAccessProps"] = noAccessProps;
    }

    // Analytics Categories
    if (properties["sortAnalyticsCategories"]) {
      analyticsCategories.sort = properties["sortAnalyticsCategories"];
    }
    if (properties["searchAnalyticsCategories"]) {
      analyticsCategories.search = properties["searchAnalyticsCategories"];
    }
    if (properties["filterAnalyticsCategories"]) {
      analyticsCategories.filter = properties["filterAnalyticsCategories"];
    }
    if (properties["exportAnalyticsCategories"]) {
      analyticsCategories.export = properties["exportAnalyticsCategories"];
    }
    if (properties["reportAnalyticsCategories"]) {
      analyticsCategories.report = properties["reportAnalyticsCategories"];
    }
    if (properties["paginationAnalyticsCategories"]) {
      analyticsCategories.pagination =
        properties["paginationAnalyticsCategories"];
    }
    if (analyticsCategories != null) {
      jsonObject["analyticsCategories"] = analyticsCategories;
    }

    if (properties["reportPillLabel"]) {
      jsonObject["reportPillLabel"] = properties["reportPillLabel"];
    }

    //Pagination Labels

    if (properties["ofLabel"]) {
      paginationLabels.of = properties["ofLabel"];
    }
    if (properties["resultsLabel"]) {
      paginationLabels.results = properties["resultsLabel"];
    }
    if (paginationLabels != null) {
      jsonObject["paginationLabels"] = paginationLabels;
    }

    //Search Options
    const searchLabelsList = [
      { key: "orderNo", name: "searchOrderNo" },
      { key: "dnoteNo", name: "searchDnoteNo" },
      { key: "invoiceNo", name: "searchInvoiceNo" },
      { key: "poNo", name: "searchPoNo" },
      { key: "serialNo", name: "searchSerialNo" },
    ];

    searchLabelsList.map((label) => {
      searchLabels[label.key] = properties[label.name];
    });

    if (searchLabels != null) {
      jsonObject["searchLabels"] = searchLabels;
    }

    if (properties["searchTitleLabel"]) {
      jsonObject["searchTitleLabel"] = properties["searchTitleLabel"];
    }
    if (properties["searchEnterLabel"]) {
      jsonObject["searchEnterLabel"] = properties["searchEnterLabel"];
    }
    if (properties["searchSorryNoRowsToDisplayLabel"]) {
      jsonObject["searchSorryNoRowsToDisplayLabel"] =
        properties["searchSorryNoRowsToDisplayLabel"];
    }
    if (properties["searchByLabel"]) {
      jsonObject["searchByLabel"] = properties["searchByLabel"];
    }

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

    if (this.agGridLicenseKey) {
      jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
    }
    if (properties["itemsPerPage"]) {
      jsonObject["itemsPerPage"] = properties["itemsPerPage"];
    }
    if (properties["shopPath"] && this.shopDomainPage) {
      jsonObject["shopURL"] = this.shopDomainPage + properties["shopPath"];
    }
    if (properties["paginationStyle"]) {
      jsonObject["paginationStyle"] = properties["paginationStyle"];
    }
    if (properties["defaultSortingColumnKey"]) {
      optionData.defaultSortingColumnKey =
        properties["defaultSortingColumnKey"];
    }
    if (properties["defaultSortingDirection"]) {
      optionData.defaultSortingDirection =
        properties["defaultSortingDirection"];
    }

    if (optionData != null) {
      jsonObject["options"] = optionData;
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

    if (properties["defaultSearchDateRange"]) {
      jsonObject["defaultSearchDateRange"] =
        properties["defaultSearchDateRange"];
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

    const filterLabelsKeys = [
      "dateRange",
      "endLabel",
      "startLabel",
      "filterTitle",
      "filterType",
      "showResultLabel",
      "orderStatus",
      "orderType",
      "open",
      "investigation",
      "shipping",
      "reject",
      "complete",
      "cancelled",
      "onHold",
      "shipped",
      "inProcess",
      "inTouch",
      "ediOrXml",
      "consignmentFillUp",
      "license",
      "tdmrsProject",
      "manual",
      "tdStaffPurchase",
      "projectOrder",
      "quotationLabel",
      "thirdParty",
      "licensing",
      "stockingOrder",
      "streamOne",
      "orderDateLabel",
      "shipDateLabel",
      "invoiceDateLabel",
      "datePlaceholder",
      "dateFormat",
    ];

    filterLabelsKeys.map((key) => (filterLabels[key] = properties[key]));

    if (filterLabels != null) {
      jsonObject["filterLabels"] = filterLabels;
    }

    if (properties["quoteIdLabel"]) {
      productGrid["quoteIdLabel"] = properties["quoteIdLabel"];
    }

    if (properties["refNoLabel"]) {
      productGrid["refNoLabel"] = properties["refNoLabel"];
    }

    if (properties["expiryDateLabel"]) {
      productGrid["expiryDateLabel"] = properties["expiryDateLabel"];
    }

    if (properties["downloadPDFLabel"]) {
      productGrid["downloadPDFLabel"] = properties["downloadPDFLabel"];
    }

    if (properties["downloadXLSLabel"]) {
      productGrid["downloadXLSLabel"] = properties["downloadXLSLabel"];
    }

    if (properties["showDownloadPDFButton"]) {
      productGrid["showDownloadPDFButton"] =
        properties["showDownloadPDFButton"];
    }

    if (properties["showDownloadXLSButton"]) {
      productGrid["showDownloadXLSButton"] =
        properties["showDownloadXLSButton"];
    }

    if (properties["showDownloadXLSButton"]) {
      productGrid["showDownloadXLSButton"] =
        properties["showDownloadXLSButton"];
    }

    if (properties["showSeeDetailsButton"]) {
      productGrid["showSeeDetailsButton"] = properties["showSeeDetailsButton"];
    }

    if (properties["seeDetailsLabel"]) {
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

    if (properties["hideCopyHeaderOption"]) {
      jsonObject["hideCopyHeaderOption"] = properties["hideCopyHeaderOption"];
    }

    if (properties["hideExportOption"]) {
      jsonObject["hideExportOption"] = properties["hideExportOption"];
    }

    if (properties["noResultsTitle"]) {
      noResultsValues.noResultsTitle = properties["noResultsTitle"];
    }

    if (properties["noResultsDescription"]) {
      noResultsValues.noResultsDescription = properties["noResultsDescription"];
    }

    if (properties["noResultsImageFileReference"]) {
      noResultsValues.noResultsImage =
        properties["noResultsImageFileReference"];
    }

    if (properties["noDataTitle"]) {
      noResultsValues.noDataTitle = properties["noDataTitle"];
    }

    if (properties["noDataDescription"]) {
      noResultsValues.noDataDescription = properties["noDataDescription"];
    }

    if (properties["noDataImageFileReference"]) {
      noResultsValues.noDataImage = properties["noDataImageFileReference"];
    }

    if (noResultsValues != null) {
      jsonObject["searchResultsError"] = noResultsValues;
    }
  }

  return {
    configJson: JSON.stringify(jsonObject),
  };
});
