/** @format */

"use strict";
use(["../../../common/utils.js"], function (utils) {
  let jsonObject = {};
  let resourceResolver = resource.getResourceResolver();
  let labels = {};
  let dNotesFlyout = {};
  let invoicesFlyout = {};

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
    "lineNo",
    "lineDescription",
    "lineStatus",
    "lineShipDate",
    "lineUnitPrice",
    "lineQuantity",
    "lineTotalPrice",
    "lineMfgPartNo",
    "lineTdsPartNo",
    "detailsActionViewDNotes",
    "detailsActionViewInvoices",
    "detailsActionModifyOrder",
    "detailsActionExportSerialNumbers",
    "detailsLineHeader",
    "detailsBack",
    "detailsOrderNo",
    "detailsActions",
    "detailsSoldTo",
    "detailsSoldToPhone",
    "detailsSoldToEmail",
    "detailsOrderAcknowledgement",
    "detailsCustomerAccountCode",
    "detailsOrderDate",
    "detailsPurchaseOrderNo",
    "detailsOrderType",
    "detailsContact",
    "detailsContactName",
    "detailsContactPhone",
    "detailsContactEmail",
    "detailsOrderSubtotal",
    "detailsTotalOrderNetPrice",
    "detailsFooterLine1",
    "detailsFooterLine2",
    "detailsFooterLine3",
    "detailsFooterLine3Link",
    "addNewItem",
    "editQuantities",
    "lineTotal",
    "modifyOrder",
    "cancel",
    "update",
    "manufacturersPartNumber",
    "quantity",
    "add",
    "additionalQuantityAdded",
  ];

  properties &&
    propertiesList.map((property) => {
      labels[property] = properties[property];
    });

  if (labels != null) {
    jsonObject["labels"] = labels;
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

  jsonObject["ordersDownloadDocumentsEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.ordersDownloadDocumentsEndpoint || "";

  jsonObject["exportAllOrderLinesEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.exportAllOrderLinesEndpoint || "";

  jsonObject["exportLinesWithSerialNumbersOnlyEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.exportLinesWithSerialNumbersOnlyEndpoint || "";

  return {
    configJson: JSON.stringify(jsonObject),
  };
});
