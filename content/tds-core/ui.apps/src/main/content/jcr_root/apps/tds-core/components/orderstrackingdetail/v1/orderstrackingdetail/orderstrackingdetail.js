"use strict";
use(["../../../common/utils.js"], function (utils) {
  var jsonObject = {};
  var labels = {};
  let dNotesFlyout = {};

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
  ];

  properties &&
    propertiesList.map((property) => {
      labels[property] = properties[property];
    });

  if (labels != null) {
    jsonObject["labels"] = labels;
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
  jsonObject["ordersDownloadDocumentsEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.ordersDownloadDocumentsEndpoint || "";

  return {
    configJson: JSON.stringify(jsonObject),
  };
});