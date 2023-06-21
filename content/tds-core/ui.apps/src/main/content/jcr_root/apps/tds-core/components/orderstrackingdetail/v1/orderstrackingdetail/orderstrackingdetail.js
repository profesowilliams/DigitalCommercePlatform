"use strict";
use(["../../../common/utils.js"], function (utils) {
    var jsonObject = {};
    let resourceResolver = resource.getResourceResolver();
    var labels = {};
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
        "update"
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
    jsonObject["ordersDownloadDocumentsEndpoint"] =
        this.serviceData.uiServiceDomain +
        this.serviceData.ordersDownloadDocumentsEndpoint || "";

    return {
        configJson: JSON.stringify(jsonObject)
    };
});