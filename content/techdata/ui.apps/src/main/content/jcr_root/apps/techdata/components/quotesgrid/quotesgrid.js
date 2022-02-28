"use strict";
use(function () {

  var jsonObject = {};

  var listValues = [];
  var iconValues = [];
  var optionData = {};
  var searchCriteriaData = {};
  var keywordDropdownData = {};
  var vendorDropdownData = {};
  var checkoutData = {};
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

  if (properties && properties["keywordDropdownLabel"]) {
    keywordDropdownData.label = properties["keywordDropdownLabel"];
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
      keywordDropdownData.items = keyValues;
    }
  }

  if (properties && properties["vendorDropdownLabel"]) {
    vendorDropdownData.label = properties["vendorDropdownLabel"];
  }

  var vendorListNode = resourceResolver.getResource(currentNode.getPath() + "/vendorList");

  if (vendorListNode !== null) {
    var childrenList = vendorListNode.getChildren();
    var vendorValues = [];
    for (var [key, res] in Iterator(childrenList)) {
      var labelKey = res.properties["vendorKey"];
      var labelValue = res.properties["vendorValue"];
      var labelData = {};
      labelData.key = labelKey;
      labelData.value = labelValue;
      vendorValues.push(labelData);
      vendorDropdownData.items = vendorValues;
    }
  }

  // Get Status Labels (OPEN, IN_PIPELINE, CLOSED...)
  var statusLabelsListValues = [];
  var statusLabelsListNode = resourceResolver.getResource(currentNode.getPath() + "/statusLabelsList");

  if (statusLabelsListNode !== null) {
    var childrenList = statusLabelsListNode.getChildren();

    for (var [key, res] in Iterator(childrenList)) {
      var labelData = {};

      labelData.labelKey = res.properties["labelKey"];
      labelData.labelValue = res.properties["labelValue"];
      
      statusLabelsListValues.push(labelData);
    }
  }
  
  if (statusLabelsListValues != null) {
    jsonObject["statusLabelsList"] = statusLabelsListValues;
  }

  if (properties && properties["label"]) {
    jsonObject["label"] = properties["label"];
  }

  if (properties && properties["gridErrorMessage"]) {
    jsonObject["gridErrorMessage"] = properties["gridErrorMessage"];
  }

  if (this.uiServiceDomain != null) {
    jsonObject["uiServiceEndPoint"] = this.uiServiceDomain + this.quoteGridEndpoint;
  }

  if (this.agGridLicenseKey) {
    jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
  }
  if (properties && properties["itemsPerPage"]) {
    jsonObject["itemsPerPage"] = properties["itemsPerPage"];
  }

  if (properties && properties["paginationStyle"]) {
    jsonObject["paginationStyle"] = properties["paginationStyle"];
  }

  if (properties && properties["quoteDetailUrl"]) {
    jsonObject["quoteDetailUrl"] = properties["quoteDetailUrl"] + ".html";
  }

  if (properties && properties["defaultSortingColumnKey"]) {
    optionData.defaultSortingColumnKey = properties["defaultSortingColumnKey"];
  }

  if (properties && properties["defaultSortingDirection"]) {
    optionData.defaultSortingDirection = properties["defaultSortingDirection"];
  }

  if (properties && properties["spaDealsIdLabel"]) {
    jsonObject["spaDealsIdLabel"] = properties["spaDealsIdLabel"];
  }

  if (listValues != null) {
    jsonObject["columnList"] = listValues;
  }

  if (iconValues != null) {
    jsonObject["iconList"] = iconValues;
  }

  if (optionData != null) {
    jsonObject["options"] = optionData;
  }

  if (properties && properties["searchTitle"]) {
    searchCriteriaData.title = properties["searchTitle"];
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

  if (properties && properties["fromLabel"]) {
    searchCriteriaData.fromLabel = properties["fromLabel"];
  }

  if (properties && properties["toLabel"]) {
    searchCriteriaData.toLabel = properties["toLabel"];
  }

  if (properties && properties["datePlaceholder"]) {
    searchCriteriaData.datePlaceholder = properties["datePlaceholder"];
  }

  if (properties && properties["menuCopy"]) {
      jsonObject["menuCopy"] = properties["menuCopy"];
  }

  if (properties && properties["menuCopyWithHeaders"]) {
      jsonObject["menuCopyWithHeaders"] = properties["menuCopyWithHeaders"];
  }

  if (properties && properties["menuExport"]) {
      jsonObject["menuExport"] = properties["menuExport"];
  }

  if (properties && properties["menuCsvExport"]) {
      jsonObject["menuCsvExport"] = properties["menuCsvExport"];
  }

  if (properties && properties["menuExcelExport"]) {
      jsonObject["menuExcelExport"] = properties["menuExcelExport"];
  }

  if (properties && properties["menuOpenLink"]) {
      jsonObject["menuOpenLink"] = properties["menuOpenLink"];
  }

  if (properties && properties["menuCopyLink"]) {
      jsonObject["menuCopyLink"] = properties["menuCopyLink"];
  }

  if (keywordDropdownData != null) {
    searchCriteriaData["keywordDropdown"] = keywordDropdownData;
  }

  if (vendorDropdownData != null) {
    searchCriteriaData["vendorsDropdown"] = vendorDropdownData;
  }

  if (searchCriteriaData != null) {
    jsonObject["searchCriteria"] = searchCriteriaData;
  }

  if (this.serviceData.replaceCartEndpoint != null) {
    checkoutData.uiServiceEndPoint = this.uiServiceDomain + this.serviceData.replaceCartEndpoint;
  }

  if (this.shopDomain != null) {
    checkoutData.redirectUrl = this.shopDomain + this.cartURL;
  }

  if (this.expressCheckoutRedirectUrl != null) {
    checkoutData.expressCheckoutRedirectUrl = this.shopDomain+this.expressCheckoutRedirectUrl;
  }

  if (checkoutData != null) {
    jsonObject["checkout"] = checkoutData;
  }

  return {
    configJson: JSON.stringify(jsonObject)
  };
});
