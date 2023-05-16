"use strict";
use(['../../../common/utils.js'], function (utils) {
    var jsonObject = {};
    var labels = {};

    // Settings
    if (this.uiServiceDomain != null && this.orderDetailEndpoint != null) {
        jsonObject["uiServiceEndPoint"] = this.uiServiceDomain + this.orderDetailEndpoint;
    }
    if (properties && properties["ordersUrl"]) {
        jsonObject["ordersUrl"] = properties["ordersUrl"];
    }
    if (this.agGridLicenseKey) {
      jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
    }
    console.log("this.agGridLicenseKey", this.agGridLicenseKey ?? "not exist");
    // Labels
    if (properties && properties["menuCopy"]) {
        labels["menuCopy"] = properties["menuCopy"];
    }
    if (properties && properties["menuCopyWithHeaders"]) {
        labels["menuCopyWithHeaders"] = properties["menuCopyWithHeaders"];
    }
    if (properties && properties["menuExport"]) {
        labels["menuExport"] = properties["menuExport"];
    }

    if (properties && properties["lineNo"]) {
        labels["lineNo"] = properties["lineNo"];
    }
    if (properties && properties["lineDescription"]) {
        labels["lineDescription"] = properties["lineDescription"];
    }
    if (properties && properties["lineStatus"]) {
        labels["lineStatus"] = properties["lineStatus"];
    }
    if (properties && properties["lineShipDate"]) {
        labels["lineShipDate"] = properties["lineShipDate"];
    }
    if (properties && properties["lineUnitPrice"]) {
        labels["lineUnitPrice"] = properties["lineUnitPrice"];
    }
    if (properties && properties["lineQuantity"]) {
        labels["lineQuantity"] = properties["lineQuantity"];
    }
    if (properties && properties["lineTotalPrice"]) {
        labels["lineTotalPrice"] = properties["lineTotalPrice"];
    }
    if (properties && properties["lineMfgPartNo"]) {
        labels["lineMfgPartNo"] = properties["lineMfgPartNo"];
    }
    if (properties && properties["lineTdsPartNo"]) {
        labels["lineTdsPartNo"] = properties["lineTdsPartNo"];
    }
    if (properties && properties["detailsLineHeader"]) {
      labels["detailsLineHeader"] = properties["detailsLineHeader"];
    }

    if (properties && properties["detailsBack"]) {
        labels["detailsBack"] = properties["detailsBack"];
    }
    if (properties && properties["detailsOrderNo"]) {
        labels["detailsOrderNo"] = properties["detailsOrderNo"];
    }
    if (properties && properties["detailsActions"]) {
        labels["detailsActions"] = properties["detailsActions"];
    }
    if (properties && properties["detailsSoldTo"]) {
        labels["detailsSoldTo"] = properties["detailsSoldTo"];
    }
    if (properties && properties["detailsSoldToPhone"]) {
        labels["detailsSoldToPhone"] = properties["detailsSoldToPhone"];
    }
    if (properties && properties["detailsSoldToEmail"]) {
        labels["detailsSoldToEmail"] = properties["detailsSoldToEmail"];
    }
    if (properties && properties["detailsOrderAcknowledgement"]) {
        labels["detailsOrderAcknowledgement"] = properties["detailsOrderAcknowledgement"];
    }
    if (properties && properties["detailsCustomerAccountCode"]) {
      labels["detailsCustomerAccountCode"] =
        properties["detailsCustomerAccountCode"];
    }
    if (properties && properties["detailsOrderDate"]) {
      labels["detailsOrderDate"] = properties["detailsOrderDate"];
    }
    if (properties && properties["detailsPurchaseOrderNo"]) {
      labels["detailsPurchaseOrderNo"] = properties["detailsPurchaseOrderNo"];
    }
    if (properties && properties["detailsOrderType"]) {
      labels["detailsOrderType"] = properties["detailsOrderType"];
    }
    if (properties && properties["detailsContact"]) {
        labels["detailsContact"] = properties["detailsContact"];
    }
    if (properties && properties["detailsContactName"]) {
        labels["detailsContactName"] = properties["detailsContactName"];
    }
    if (properties && properties["detailsContactPhone"]) {
        labels["detailsContactPhone"] = properties["detailsContactPhone"];
    }
    if (properties && properties["detailsContactEmail"]) {
        labels["detailsContactEmail"] = properties["detailsContactEmail"];
    }

    if (labels != null) {
        jsonObject["labels"] = labels;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});