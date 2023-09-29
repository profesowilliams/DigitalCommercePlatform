/** @format */

"use strict";
use(["../../../common/utils.js"], function (utils) {
  let jsonObject = {};
  let resourceResolver = resource.getResourceResolver();
  let labels = {};
  let itemsLabels = {};
  let actionLabels = {};
  let soldToLabels = {};
  let orderAcknowledgementLabels = {};
  let contactLabels = {};
  let footerLabels = {};
  let orderModifyLabels = {};
  let dNotesFlyout = {};
  let invoicesFlyout = {};
  let exportFlyout = {};
  const productReplacementFlyout = {};

  // Settings
  if (this.uiServiceDomain != null && this.orderDetailEndpoint != null) {
    jsonObject["uiServiceEndPoint"] =
      this.uiServiceDomain + this.orderDetailEndpoint;
  }
  if (properties && properties["ordersUrl"]) {
    jsonObject["ordersUrl"] = properties["ordersUrl"];
  }
  if (this.agGridLicenseKey) {
    jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
  }

  // Labels
  const propertiesList = [
    "menuCopy",
    "menuCopyWithHeaders",
    "menuExport",
    "back",
    "orderNo",
    "actions",
  ];

  properties &&
    propertiesList.map((property) => {
      labels[property] = properties[property];
    });

  if (labels != null) {
    jsonObject["labels"] = labels;
  }

  // ItemsLabels
  const itemsLabelsList = [
    "header",
    "lineNo",
    "description",
    "lineStatus",
    "shipDate",
    "unitPrice",
    "itemsQuantity",
    "lineTotalPrice",
    "mfrPartNo",
    "tdsPartNo",
    "seeOptions",
  ];

  properties &&
    itemsLabelsList.map((property) => {
      itemsLabels[property] = properties[property];
    });

  if (itemsLabels != null) {
    jsonObject["itemsLabels"] = itemsLabels;
  }

  // ActionLabels
  const actionLabelsList = [
    "viewDNotes",
    "viewInvoices",
    "actionModifyOrder",
    "exportSerialNumbers",
    "track",
    "toasterCopySerialNumbersMessage",
    "copySerialNumber",
    "return",
  ];

  properties &&
    actionLabelsList.map((property) => {
      actionLabels[property] = properties[property];
    });

  if (actionLabels != null) {
    jsonObject["actionLabels"] = actionLabels;
  }

  // SoldToLabels
  const soldToLabelsList = ["soldTo", "soldToPhone", "soldToEmail"];

  properties &&
    soldToLabelsList.map((property) => {
      soldToLabels[property] = properties[property];
    });

  if (soldToLabels != null) {
    jsonObject["soldToLabels"] = soldToLabels;
  }

  // OrderAcknowledgementLabels
  const orderAcknowledgementLabelsList = [
    "orderAcknowledgement",
    "customerAccountCode",
    "orderDate",
    "purchaseOrderNo",
    "orderType",
  ];

  properties &&
    orderAcknowledgementLabelsList.map((property) => {
      orderAcknowledgementLabels[property] = properties[property];
    });

  if (orderAcknowledgementLabels != null) {
    jsonObject["orderAcknowledgementLabels"] = orderAcknowledgementLabels;
  }

  // ContactLabels
  const contactLabelsList = [
    "contact",
    "contactName",
    "contactPhone",
    "contactEmail",
  ];

  properties &&
    contactLabelsList.map((property) => {
      contactLabels[property] = properties[property];
    });

  if (contactLabels != null) {
    jsonObject["contactLabels"] = contactLabels;
  }

  // FooterLabels
  const footerLabelsList = [
    "orderSubtotal",
    "totalOrderNetPrice",
    "line1",
    "line2",
    "line3",
    "line3Link",
  ];

  properties &&
    footerLabelsList.map((property) => {
      footerLabels[property] = properties[property];
    });

  if (footerLabels != null) {
    jsonObject["footerLabels"] = footerLabels;
  }

  // OrderModifyLabels
  const orderModifyLabelsList = [
    "addNewItem",
    "editQuantities",
    "modifyOrder",
    "lineTotal",
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
  ];

  properties &&
    orderModifyLabelsList.map((property) => {
      orderModifyLabels[property] = properties[property];
    });

  if (orderModifyLabels != null) {
    jsonObject["orderModifyLabels"] = orderModifyLabels;
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
  const invoicesLabelsList = [
    { key: "title", name: "invoicesFlyoutTitle" },
    { key: "description", name: "invoicesFlyoutDescription" },
    { key: "orderNo", name: "invoicesFlyoutOrderNo" },
    { key: "poNo", name: "invoicesFlyoutPoNo" },
    { key: "button", name: "invoicesFlyoutButton" },
    { key: "clearAllButton", name: "invoicesFlyoutClearAllButton" },
  ];

  properties &&
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

  properties &&
    dnotesLabelsList.map((label) => {
      dNotesFlyout[label.key] = properties[label.name];
    });

  if (dNotesFlyout != null) {
    jsonObject["dNotesFlyout"] = dNotesFlyout;
  }

  // Export Flyout
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
  ];

  properties &&
    exportFlyoutLabels.map((label) => {
      exportFlyout[label.key] = properties[label.name];
    });

  if (exportFlyout != null) {
    jsonObject["exportFlyout"] = exportFlyout;
  }

  jsonObject["ordersDownloadDocumentsEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.ordersDownloadDocumentsEndpoint || "";

  jsonObject["exportAllOrderLinesEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.exportAllOrderLinesEndpoint || "";

  jsonObject["exportLinesWithSerialNumbersOnlyEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.exportLinesWithSerialNumbersOnlyEndpoint || "";

  jsonObject["replaceProductEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.replaceProductEndpoint || "";

  // Product Replacement Flyout
  const productReplacementFlyoutLabels = [
    "replacementModifyOrder",
    "pleaseSelect",
    "replaceWithSuggestedItem",
    "removeWithoutReplacement",
  ];

  properties &&
    productReplacementFlyoutLabels.map((property) => {
      productReplacementFlyout[property] = properties[property];
    });

  if (productReplacementFlyout != null) {
    jsonObject["productReplacementFlyout"] = productReplacementFlyout;
  }

  jsonObject["orderModifyEndpoint"] =
    this.serviceData.uiServiceDomain + this.serviceData.orderModifyEndpoint ||
    "";

  jsonObject["orderModifyChangeEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.orderModifyChangeEndpoint || "";

  return {
    configJson: JSON.stringify(jsonObject),
  };
});
