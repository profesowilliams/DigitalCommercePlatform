"use strict";
use(['../../../common/utils.js'], function (utils) {
  var jsonObject = {};
  var labels = {};

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

  return {
    configJson: JSON.stringify(jsonObject),
  };
});