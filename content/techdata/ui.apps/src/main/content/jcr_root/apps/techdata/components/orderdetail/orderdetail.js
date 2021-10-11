"use strict";
use(function () {

    var jsonObject = {};

    var headerJsonObject = {};
    var infoJsonObject = {};
    var iconValues = [];
    var listValues = [];
    var productInfo = {};

    var resourceResolver = resource.getResourceResolver();

    var node = resourceResolver.getResource(currentNode.getPath() + "/columnList");

    if (node !== null) {
        var childrenList = node.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var columnLabel = res.properties["columnLabel"];
            var columnKey = res.properties["columnKey"];
            var sortable = res.properties["sortable"];
            var itemData = {};
            itemData.columnLabel = columnLabel;
            itemData.columnKey = columnKey;
            itemData.sortable = sortable;
            listValues.push(itemData);

        }
    }

    var iconListNode = resourceResolver.getResource(currentNode.getPath() + "/iconList");

    if (iconListNode !== null) {
        var childrenList = iconListNode.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var iconKey = res.properties["iconKey"];
            var iconValue = res.properties["iconValue"];
            var iconText = res.properties["iconText"];
            var itemData = {};
            itemData.iconKey = iconKey;
            itemData.iconValue = iconValue;
            itemData.iconText = iconText;
            iconValues.push(itemData);

        }


    }

    if (listValues != null) {
        productInfo["columnList"] = listValues;
    }

    if (iconValues != null) {
        productInfo["iconList"] = iconValues;
    }

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

    if (properties && properties["orderStatusItemsInReview"]) {
        infoJsonObject["orderStatusItemsInReview"] = properties["orderStatusItemsInReview"];
    }

    if (properties && properties["orderStatusItemsShippedDescription"]) {
        infoJsonObject["orderStatusItemsShippedDescription"] = properties["orderStatusItemsShippedDescription"];
    }

    if (properties && properties["orderStatusItemsInProcessDescription"]) {
        infoJsonObject["orderStatusItemsInProcessDescription"] = properties["orderStatusItemsInProcessDescription"];
    }

    if (properties && properties["orderStatusItemsInReviewDescription"]) {
        infoJsonObject["orderStatusItemsInReviewDescription"] = properties["orderStatusItemsInReviewDescription"];
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

    if (properties && properties["subTotalLabel"]) {
        infoJsonObject["subTotalLabel"] = properties["subTotalLabel"];
    }

    if (properties && properties["freightLabel"]) {
        infoJsonObject["freightLabel"] = properties["freightLabel"];
    }

    if (properties && properties["taxLabel"]) {
        infoJsonObject["taxLabel"] = properties["taxLabel"];
    }

    if (properties && properties["otherFeesLabel"]) {
        infoJsonObject["otherFeesLabel"] = properties["otherFeesLabel"];
    }

    if (properties && properties["paymentTermsLabel"]) {
        infoJsonObject["paymentTermsLabel"] = properties["paymentTermsLabel"];
    }

    if (properties && properties["paymentTotalLabel"]) {
        infoJsonObject["paymentTotalLabel"] = properties["paymentTotalLabel"];
    }

    if (properties && properties["currencyLabel"]) {
        infoJsonObject["currencyLabel"] = properties["currencyLabel"];
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

    if (properties && properties["phoneNumberLabel"]) {
        headerJsonObject["phoneNumberLabel"] = properties["phoneNumberLabel"];
    }

    if (properties && properties["exportCSVLabel"]) {
        headerJsonObject["exportCSVLabel"] = properties["exportCSVLabel"];
    }

    if (this.uiServiceDomain != null) {
        jsonObject["uiServiceEndPoint"] = this.uiServiceDomain+this.orderDetailEndpoint;
    }

    jsonObject["headerConfig"] = headerJsonObject;
    jsonObject["infoConfig"] = infoJsonObject;
    jsonObject["productLines"] = productInfo;

    return {
        configJson: JSON.stringify(jsonObject)
    };
});