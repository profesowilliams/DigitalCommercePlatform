/** @format */

"use strict";
use(["../../../common/utils.js"], function (utils) {
  const jsonObject = {};
  const resourceResolver = resource.getResourceResolver();
  const labels = {};
  const itemsLabels = {};
  const actionLabels = {};
  const soldToLabels = {};
  const orderAcknowledgementLabels = {};
  const contactLabels = {};
  const footerLabels = {};
  const orderModifyLabels = {};
  const trackingFlyout = {};
  const returnFlyout = {};
  const dNotesFlyout = {};
  const invoicesFlyout = {};
  const exportFlyout = {};
  const productReplacementFlyout = {};
  const statusesLabels = {};

  jsonObject["uiServiceDomain"] = this.uiServiceDomain;
  jsonObject["uiCommerceServiceDomain"] = this.uiServiceDomain + `/ui-commerce`;

  // Settings
  if (this.uiServiceDomain != null && this.orderDetailEndpoint != null) {
    jsonObject["uiServiceEndPoint"] =
      this.uiServiceDomain + this.serviceData.orderDetailGridEndpoint;
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
    "completeDeliveryOnly",
    "actions",
    "migrationInfoBoxText",
    "originalInfoBoxText",
    "viewOrderText",
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
    "descriptionPN",
    "lineStatus",
    "shipDate",
    "unitPrice",
    "itemsQuantity",
    "lineTotalPrice",
    "mfrPartNo",
    "tdsPartNo",
    "seeOptions",
    "endOfLife",
    "itemsUpdateErrorMessage",
    "endUserInfoTemplate",
    "endUserInfoClose",
    "shippedByLabel",
    "tdSynnexPOLabel",
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
    "releaseTheOrder",
    "actionModifyOrder",
    "exportSerialNumbers",
    "xmlMessageLabel",
    "xmlMessageAlertLabel",
    "track",
    "toasterCopySerialNumbersMessage",
    "copySerialNumber",
    "return",
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

  properties &&
    actionLabelsList.map((property) => {
      actionLabels[property] = properties[property];
    });

  if (actionLabels != null) {
    jsonObject["actionLabels"] = actionLabels;
  }

  // SoldToLabels
  const soldToLabelsList = [
    "soldTo",
    "soldToPhone",
    "soldToEmail",
    "shipToTemplate",
  ];

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
  const contactLabelsList = ["contact", "contactPhone"];

  properties &&
    contactLabelsList.map((property) => {
      contactLabels[property] = properties[property];
    });

  if (contactLabels != null) {
    jsonObject["contactLabels"] = contactLabels;
  }

  // FooterLabels
  const footerLabelsList = [
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
    "modifyOrderTitle",
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
    "cancelNewItem",
    "updateSucessMessage",
    "modifyErrorMessage",
    "modifyUpdateErrorMessage",
    "updateErrorListMessage",
    "line",
    "reduceQuantity",
    "addNewLine",
    "pleaseTryAgain",
    "newItemInfo",
    "newItemRemove",
    "newItemErrorMessage",
  ];

  properties &&
    orderModifyLabelsList.map((property) => {
      orderModifyLabels[property] = properties[property];
    });

  if (orderModifyLabels != null) {
    jsonObject["orderModifyLabels"] = orderModifyLabels;
  }

  // Tracking Flyout Labels
  const trackingFlyoutList = [
    "titleTracking",
    "descriptionTracking",
    "mfrNoTracking",
    "tdsNoTracking",
    "buttonTracking",
    "cancelButtonTracking",
    "idColumnTracking",
    "shipDateColumnTracking",
  ];

  properties &&
    trackingFlyoutList.map((property) => {
      trackingFlyout[property] = properties[property];
    });

  if (trackingFlyout != null) {
    jsonObject["trackingFlyout"] = trackingFlyout;
  }

  // Return Flyout Labels
  const returnFlyoutList = [
    "titleReturn",
    "descriptionReturn",
    "mfrNoReturn",
    "tdsNoReturn",
    "buttonReturn",
    "cancelButtonReturn",
    "idColumnReturn",
    "shipDateColumnReturn",
  ];

  properties &&
    returnFlyoutList.map((property) => {
      returnFlyout[property] = properties[property];
    });

  if (returnFlyout != null) {
    jsonObject["returnFlyout"] = returnFlyout;
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

  jsonObject["orderDetailEndpoint"] =
    this.serviceData.uiServiceDomain + this.serviceData.orderDetailEndpoint ||
    "";

  jsonObject["exportAllOrderLinesEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.exportAllOrderLinesEndpoint || "";

  jsonObject["exportLinesWithSerialNumbersOnlyEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.exportLinesWithSerialNumbersOnlyEndpoint || "";

  jsonObject["replaceProductEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.replaceProductEndpoint || "";

  jsonObject["replacementsProductsEndpoint"] =
    this.serviceData.uiServiceDomain +
      this.serviceData.replacementsProductsEndpoint || "";

  // Product Replacement Flyout
  const productReplacementFlyoutLabels = [
    "replacementModifyOrder",
    "pleaseSelect",
    "qty",
    "unitCost",
    "replaceWithSuggestedItem",
    "removeWithoutReplacement",
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
