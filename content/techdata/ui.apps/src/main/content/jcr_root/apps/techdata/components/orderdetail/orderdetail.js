"use strict";
use(function () {

    var jsonObject = {};

    var headerJsonObject = {};
    var infoJsonObject = {};
    var iconValues = [];
    var listValues = [];
    var productInfo = {};
    var keywordDropdownData = {};
    var searchCriteriaData = {};
    var searchByDropDown = {};
    var exportColumnListTab = {};
    var exportColumnListValues = [];

    var resourceResolver = resource.getResourceResolver();

    var node = resourceResolver.getResource(currentNode.getPath() + "/columnList");

    var exportColumnListNode = resourceResolver.getResource(currentNode.getPath() + "/exportColumnList");


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

    if (this.shopDomainPage !== null) {
        productInfo["shopDomainPage"] = this.shopDomainPage;
    }

    if (listValues != null) {
        productInfo["columnList"] = listValues;
    }

    if (iconValues != null) {
        productInfo["iconList"] = iconValues;
    }

    //Serial No Label section
    if (properties && properties["serialCellLabel"]) {
        productInfo["serialCellLabel"] = properties["serialCellLabel"];
    }

    //Serial No Label section
    if (properties && properties["serialModal"]) {
        productInfo["serialModal"] = properties["serialModal"];
    }

    //Serial No Not present label
    if (properties && properties["serialCellNotFoundMessage"]) {
        productInfo["serialCellNotFoundMessage"] = properties["serialCellNotFoundMessage"];
    }

    var keywordListNode = resourceResolver.getResource(currentNode.getPath() + "/keywordList");

    if (keywordListNode !== null) {
        var childrenList = keywordListNode.getChildren();
        var keyValues = [];
        for (var [key, res] in Iterator(childrenList)) {
            var labelKey = res.properties["key"];
            var labelValue = res.properties["value"];
            var labelData = {};
            labelData.key = labelKey;
            labelData.value = labelValue;
            keyValues.push(labelData);
            searchByDropDown.items = keyValues;
        }
    }

    if (properties && properties["keywordDropdownLabel"]) {
        searchByDropDown.label = properties["keywordDropdownLabel"];
    }

    if (properties && properties["searchButtonLabel"]) {
        searchCriteriaData.searchButtonLabel = properties["searchButtonLabel"];
    }

    if (properties && properties["clearButtonLabel"]) {
        searchCriteriaData.clearButtonLabel = properties["clearButtonLabel"];
    }

    if (properties && properties["inputPlaceholder"]) {
        searchCriteriaData.inputPlaceholder = properties["inputPlaceholder"];
    }

    if (properties && properties["searchTitle"]) {
        searchCriteriaData.title = properties["searchTitle"];
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


    if (this.uiServiceDomain != null && this.downloadIndividualInvoiceEndpoint != null) {
        jsonObject["downloadInvoicesEndpoint"] = this.uiServiceDomain+this.downloadIndividualInvoiceEndpoint;
    }

    if (this.uiServiceDomain != null && this.orderDetailEndpoint != null) {
        jsonObject["uiServiceEndPoint"] = this.uiServiceDomain+this.orderDetailEndpoint;
    }

    if (this.uiServiceDomain != null && this.downloadOrderDetailsEndpoint != null) {
        jsonObject["downloadOrderDetailsEndpoint"] = this.uiServiceDomain+this.downloadOrderDetailsEndpoint;
    }

    if (searchByDropDown != null) {
        keywordDropdownData["searchbyDropdown"] = searchByDropDown;
    }

    if (keywordDropdownData != null) {
        searchCriteriaData["searchbyDropdown"] = searchByDropDown;
    }

    if (searchCriteriaData != null) {
        productInfo["searchCriteria"] = searchCriteriaData;
    }

    if (exportColumnListNode !== null) {
        var childrenList = exportColumnListNode.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var columnLabel = res.properties["columnLabel"];
            var columnKey = res.properties["columnKey"];
            var itemData = {};
            itemData.columnLabel = columnLabel;
            itemData.columnKey = columnKey;
            exportColumnListValues.push(itemData);
        }
    }

    
    if (exportColumnListValues != null) {
        exportColumnListTab["columnList"] = exportColumnListValues;
    }

    if (exportColumnListTab != null) {
        jsonObject["exportColumnList"] = exportColumnListTab;
    }

    var trackingConfigTrackingLogos = resourceResolver.getResource(currentNode.getPath() + "/trackingIcons");

    function populateTrackingConfigJson(trackingConfigTrackingLogos)
    {
        var trackingJson = {};
        var trackingIconArray = [];

        if (trackingConfigTrackingLogos !== null) {
            var childrenList = trackingConfigTrackingLogos.getChildren();

            for (var [key, res] in Iterator(childrenList)) {
                var carrier = res.properties["carrier"];
                var logoPath = res.properties["logoPath"];
                var itemData = {};
                itemData.carrier = carrier;
                itemData.logoPath = logoPath;
                trackingIconArray.push(itemData);
            }
        }

        trackingJson.trackingIcons = trackingIconArray;
        trackingJson.modalTitle = properties["modalTitle"];
        trackingJson.multipleOrderInformation = properties["multipleOrderInformation"];

        return trackingJson;

    }

    productInfo.trackingConfig = populateTrackingConfigJson(trackingConfigTrackingLogos);

    jsonObject["headerConfig"] = headerJsonObject;
    jsonObject["infoConfig"] = infoJsonObject;
    jsonObject["productLines"] = productInfo;

    return {
        configJson: JSON.stringify(jsonObject)
    };
});