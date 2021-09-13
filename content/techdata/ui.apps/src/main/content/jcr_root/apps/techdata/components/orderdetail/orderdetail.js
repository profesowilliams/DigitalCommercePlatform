"use strict";
use(function () {

    var jsonObject = {};

    var headerJsonObject = {};
    var infoJsonObject = {};

    //info section json being constructed
    if (properties && properties["orderStatusLabel"]) {
        infoJsonObject["orderStatusLabel"] = properties["orderStatusLabel"];
    }

    if (properties && properties["orderStatusItemsShipped"]) {
        infoJsonObject["orderStatusItemsShipped"] = properties["orderStatusItemsShipped"];
    }

    if (properties && properties["orderStatusItemsInProcess"]) {
        infoJsonObject["orderStatusItemsInProcess"] = properties["orderStatusItemsInProcess"];
    }

    if (properties && properties["orderStatusItemsShippedDescription"]) {
        infoJsonObject["orderStatusItemsShippedDescription"] = properties["orderStatusItemsShippedDescription"];
    }

    if (properties && properties["orderStatusItemsInProcessDescription"]) {
        infoJsonObject["orderStatusItemsInProcessDescription"] = properties["orderStatusItemsInProcessDescription"];
    }

    if (properties && properties["endUserLabel"]) {
        infoJsonObject["endUserLabel"] = properties["endUserLabel"];
    }

    if (properties && properties["shipToLabel"]) {
        infoJsonObject["shipToLabel"] = properties["shipToLabel"];
    }

    if (properties && properties["blindPackagingUsed"]) {
        infoJsonObject["blindPackagingUsed"] = properties["blindPackagingUsed"];
    }

    if (properties && properties["blindPackagingNotUsed"]) {
        infoJsonObject["blindPackagingNotUsed"] = properties["blindPackagingNotUsed"];
    }

    if (properties && properties["paymentLabel"]) {
        infoJsonObject["paymentLabel"] = properties["paymentLabel"];
    }

    // header information json being constructed
    if (properties && properties["orderLabel"]) {
        headerJsonObject["orderLabel"] = properties["orderLabel"];
    }

    if (properties && properties["orderDateLabel"]) {
        headerJsonObject["orderDateLabel"] = properties["orderDateLabel"];
    }

    if (properties && properties["purchaseOrderLabel"]) {
        headerJsonObject["purchaseOrderLabel"] = properties["purchaseOrderLabel"];
    }

    if (properties && properties["exportCSVLabel"]) {
        headerJsonObject["exportCSVLabel"] = properties["exportCSVLabel"];
    }

    if (this.uiServiceDomain != null) {
        jsonObject["uiServiceEndPoint"] = this.uiServiceDomain+this.orderDetailEndpoint;
    }

    jsonObject["headerConfig"] = headerJsonObject;
    jsonObject["infoConfig"] = infoJsonObject;

    return {
        configJson: JSON.stringify(jsonObject)
    };
});