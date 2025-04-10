/** @format */

"use strict";
use(["../common/utils.js"], function (utils) {
  const jsonObject = {};
  const resourceResolver = resource.getResourceResolver();
  const optionData = {};
  const productGrid = {};
  const iconsStatuses = {};
  const icons = {};
  const noResultsValues = {};
  const dNotesFlyout = {};
  const reportLabels = {};
  const orderLineDetailsShippedColumnLabels = {};
  const orderLineDetailsNotShippedColumnLabels = {};
  const orderModifyLabels = {};
  const settingsFlyoutLabels = {};
  const invoicesFlyout = {};
  const orderLineDetails = {};
  const noAccessProps = {};
  const analyticsCategories = {};
  const paginationLabels = {};
  const searchLabels = {};
  const filterLabels = {};
  const productReplacementFlyout = {};
  const statusesLabels = {};

  if (properties) {
    const labelsList = [
      "detailUrl",
      "displayCurrencyName",
      "last30DaysCriteria",
      "last90DaysCriteria",
      "searchPlaceholder",
      "multiple",
      "shipToTooltipTemplate",
      "eolUpdateErrorMessage",
      "menuCopy",
      "menuCopyWithHeaders",
      "menuExport",
      "filterTooltip",
      "reportTooltip",
      "settingsTooltip",
      "exportTooltip",
      "menuCsvExport",
      "menuExcelExport",
      "menuOpenLink",
      "menuCopyLink",
      "ofTextLabel",
      "endOfLife",
      "eolSeeOptions",
    ];

    labelsList.map((property) => {
      if (properties[property]) {
        jsonObject[property] = properties[property];
      }
    });

    //Icons Statuses
    const iconsStatusesLabel = [
      "completeDeliveryOnly",
      "iconInvestigation",
      "rejected",
      "completed",
    ];

    iconsStatusesLabel.map(
      (label) => (iconsStatuses[label] = properties[label])
    );
    jsonObject["iconsStatuses"] = iconsStatuses;

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

    // Order Details Tab
    const orderLineDetailsLabels = [
      "migrationInfoBoxText",
      "originalInfoBoxText",
      "viewOrderText",
      "shippedLabel",
      "notShippedLabel",
      "itemsLabel",
      "trackLabel",
      "activateHere",
      "modifyEligibleItemsLabel",
      "titleReleaseModal",
      "orderNoString",
      "PONoString",
      "upperText",
      "lowerText",
      "cancelString",
      "releaseOrderString",
      "releaseButtonLabel",
      "releaseSuccessText",
      "releaseFailText",
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
      "flyoutCancel",
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
      "cancelNewItem",
      "updateSucessMessage",
      "updateErrorMessage",
      "updateErrorListMessage",
      "line",
      "reduceQuantity",
      "addNewLine",
      "pleaseTryAgain",
      "newItemInfo",
      "newItemRemove",
      "newItemErrorMessage",
      "sorry",
      "thereAreNoItemsAddNew",
      "thereAreNoItems",
    ];

    orderModifyLabelsList.map((property) => {
      orderModifyLabels[property] = properties[property];
    });

    if (orderModifyLabels != null) {
      jsonObject["orderModifyLabels"] = orderModifyLabels;
    }

    const settingsFlyoutLabelsList = [
      "switchLabel",
      "save",
      "cancelSettingsChange",
      "notificationMessages",
      "notificationTypes",
      "notificationEmails",
      "rangeIntouchOnly",
      "rangeTdSynnex",
      "shippedFromTDSWarehouse",
      "outForDelivery",
      "delivered",
      "deliveryException",
      "defaultEmailAddress",
      "addAnotherEmail",
      "newEmailAddress",
      "emailsErrorMessage",
      "forInternalUseOnly",
      "settingsSuccessMessage",
      "settingsErrorMessage",
      "adjustSettings",
    ];

    settingsFlyoutLabelsList.map((property) => {
      settingsFlyoutLabels[property] = properties[property];
    });

    if (settingsFlyoutLabels != null) {
      jsonObject["settingsFlyoutLabels"] = settingsFlyoutLabels;
    }

    jsonObject["uiServiceEndPoint"] =
      this.serviceData.uiServiceDomain + this.serviceData.orderGridEndpoint ||
      "";

    jsonObject["uiCommerceServiceDomain"] =
      this.serviceData.uiServiceDomain + `/ui-commerce`;

    jsonObject["uiProactiveServiceDomain"] =
      this.serviceData.uiServiceDomain + `/ui-proactive`;

    jsonObject["uiLocalizeServiceDomain"] =
      this.serviceData.uiServiceDomain + `/ui-localize`;

    const endpoints = [
      "downloadAllInvoicesEndpoint",
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

    // No Access Screen
    const noAccessLabelList = [
      "noAccessTitle",
      "noAccessMessage",
      "noAccessBack",
      "noAccessLink",
      "unavailableTitle",
      "unavailableText",
    ];
    noAccessLabelList.map((label) => {
      noAccessProps[label] = properties[label];
    });

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

    //Pagination Labels

    if (properties["ofLabel"]) {
      paginationLabels.ofLabel = properties["ofLabel"];
    }
    if (properties["resultsLabel"]) {
      paginationLabels.resultsLabel = properties["resultsLabel"];
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
    if (properties["pageTitle"]) {
      jsonObject["pageTitle"] = properties["pageTitle"];
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

    if (properties["defaultSearchDateRange"]) {
      jsonObject["defaultSearchDateRange"] =
        properties["defaultSearchDateRange"];
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
      "pastDateRange",
      "etaDate",
      "futureDateRange",
      "invoiceDateLabel",
      "datePlaceholder",
      "dateFormat",
      "shortDateFormat",
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

    // Product Replacement Flyout
    const productReplacementFlyoutLabels = [
      "replacementModifyOrder",
      "pleaseSelect",
      "qtyReplacement",
      "unitCost",
      "replaceWithSuggestedItem",
      "removeWithoutReplacement",
      "cancelReplacement",
      "updateReplacement",
      "lineTotalReplacement",
      "quantityReplacement",
      "lineMfgPartNoReplacement",
      "replacementUpdateSucessMessage",
      "replacementUpdateErrorMessage",
      "replacementUpdateErrorListMessage",
      "replacementLine",
      "replacementReduceQuantity",
      "replacementAddNewLine",
      "replacementPleaseTryAgain",
    ];

    properties &&
      productReplacementFlyoutLabels.map((property) => {
        productReplacementFlyout[property] = properties[property];
      });

    if (productReplacementFlyout != null) {
      jsonObject["productReplacementFlyout"] = productReplacementFlyout;
    }

    //Statuses Modal

    const statusLabelsKeys = ["statusesTitle", "statusesClose"];
    const statusesList = [
      {
        title: "statusTitleAcknowledged",
        explanation: "statusExplanationAcknowledged",
      },
      {
        title: "statusTitleEstimated",
        explanation: "statusExplanationEstimated",
      },
      {
        title: "statusTitleConfirmed",
        explanation: "statusExplanationConfirmed",
      },
      {
        title: "statusTitleAvailable",
        explanation: "statusExplanationAvailable",
      },
      { title: "statusTitleShipped", explanation: "statusExplanationShipped" },
      {
        title: "statusTitleConstraint",
        explanation: "statusExplanationConstraint",
      },
      {
        title: "statusTitleExpedited",
        explanation: "statusExplanationExpedited",
      },
      { title: "statusTitleTransit", explanation: "statusExplanationTransit" },
      {
        title: "statusTitleInvestigation",
        explanation: "statusExplanationInvestigation",
      },
      { title: "statusTitleDamaged", explanation: "statusExplanationDamaged" },
      {
        title: "statusTitleLateDelivery",
        explanation: "statusExplanationLateDelivery",
      },
      {
        title: "statusTitleDelivered",
        explanation: "statusExplanationDelivered",
      },
    ];

    statusLabelsKeys.map((key) => {
      if (properties[key]) {
        statusesLabels[key] = properties[key];
      }
    });

    const newStatusesList = [];

    statusesList.forEach((el) => {
      if (properties[el.title] && properties[el.explanation]) {
        newStatusesList.push({
          title: properties[el.title],
          explanation: properties[el.explanation],
        });
        el.title = properties[el.title];
        el.explanation = properties[el.explanation];
      }
    });

    statusesLabels["statusesList"] = newStatusesList;

    if (Object.keys(statusesLabels).length > 0) {
      jsonObject["statusesLabels"] = statusesLabels;
    }
  }

  return {
    configJson: JSON.stringify(jsonObject),
  };
});
