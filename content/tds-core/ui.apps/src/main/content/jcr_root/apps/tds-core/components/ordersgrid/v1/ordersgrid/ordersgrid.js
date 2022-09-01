"use strict";
use(function () {
  var jsonObject = {};
  var iconValues = [];
  var listValues = [];
  var labelValues = [];
  var keywordDropdownValues = [];
  var optionData = {};
  var searchCriteriaData = {};
  var keywordDropdownData = {};
  var vendorDropdownData = {};
  var methodDropdownData = {};
  var resourceResolver = resource.getResourceResolver();
  var invoicesModalData = {};
  var trackingConfig = {};

  var node = resourceResolver.getResource(currentNode.getPath() + "/columnList");
  var trackingConfigTrackingLogos = resourceResolver.getResource(currentNode.getPath() + "/trackingIcons");

  function populateTrackingConfigJson(trackingConfigTrackingLogos) {
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

  var labelListNode = resourceResolver.getResource(currentNode.getPath() + "/labelList");

  if (labelListNode !== null) {
    var childrenList = labelListNode.getChildren();

    for (var [key, res] in Iterator(childrenList)) {
      var labelKey = res.properties["labelKey"];
      var labelValue = res.properties["labelValue"];
      var labelData = {};
      labelData.labelKey = labelKey;
      labelData.labelValue = labelValue;
      labelValues.push(labelData);
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

  if (this.agGridLicenseKey) { 
    jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
  }

  if (properties && properties["methodDropdownLabel"]) {
    methodDropdownData.label = properties["methodDropdownLabel"];
  }

  var methodListNode = resourceResolver.getResource(currentNode.getPath() + "/methodList");

  if (methodListNode !== null) {
    var childrenList = methodListNode.getChildren();
    var keyValues = [];
    for (var [key, res] in Iterator(childrenList)) {
      var labelKey = res.properties["methodKey"];
      var labelValue = res.properties["methodValue"];
      var labelData = {};
      labelData.key = labelKey;
      labelData.value = labelValue;
      keyValues.push(labelData);
      methodDropdownData.items = keyValues;
    }
  }

  if (properties && properties["label"]) {
    jsonObject["label"] = properties["label"];
  }
  if (this.uiServiceDomain != null) {
    jsonObject["uiServiceEndPoint"] = this.uiServiceDomain + this.orderGridEndpoint;
    jsonObject["downloadAllInvoicesEndpoint"] = this.uiServiceDomain + this.downloadAllInvoicesEndpoint;
  }

  if (this.shopDomain) {
    jsonObject["shopDomain"] = this.shopDomain;
  }

  if (properties && properties["itemsPerPage"]) {
    jsonObject["itemsPerPage"] = properties["itemsPerPage"];
  }
  if (properties && properties["paginationStyle"]) {
    jsonObject["paginationStyle"] = properties["paginationStyle"];
  }
  if (properties && properties["orderDetailUrl"]) {
    jsonObject["orderDetailUrl"] = properties["orderDetailUrl"];
  }

  if (properties && properties["legacyOrderDetailsUrl"]) {
    jsonObject["legacyOrderDetailsUrl"] = properties["legacyOrderDetailsUrl"];
  }

  if (properties && properties["errorLoginMessage"]) {
    jsonObject["errorLoginMessage"] = properties["errorLoginMessage"];
  }

  if (properties && properties["defaultSortingColumnKey"]) {
    optionData.defaultSortingColumnKey = properties["defaultSortingColumnKey"];
  }

  if (properties && properties["defaultSortingDirection"]) {
    optionData.defaultSortingDirection = properties["defaultSortingDirection"];
  }
  if (properties && properties["title"]) {
    invoicesModalData.title = properties["title"];
  }

  if (properties && properties["buttonIcon"]) {
    invoicesModalData.buttonIcon = properties["buttonIcon"];
  }

  if (properties && properties["buttonLabel"]) {
    invoicesModalData.buttonLabel = properties["buttonLabel"];
  }

  if (properties && properties["content"]) {
    invoicesModalData.content = properties["content"];
  }

  if (properties && properties["pendingInfo"]) {
    invoicesModalData.pendingInfo = properties["pendingInfo"];
  }

  if (properties && properties["errorMessage"]) {
    invoicesModalData.errorMessage = properties["errorMessage"];
  }

  if (listValues != null) {
    jsonObject["columnList"] = listValues;
  }

  if (optionData != null) {
    jsonObject["options"] = optionData;
  }

  if (invoicesModalData != null) {
    jsonObject["invoicesModal"] = invoicesModalData;
  }

  if (iconValues != null) {
    jsonObject["iconList"] = iconValues;
  }

  if (labelValues != null) {
    jsonObject["labelList"] = labelValues;
  }
  if (properties && properties["searchTitle"]) {
    searchCriteriaData.title = properties["searchTitle"];
  }

  if (properties && properties["labelButtonFilter"]) {
    searchCriteriaData.labelButtonFilter = properties["labelButtonFilter"];
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
  if (keywordDropdownData != null) {
    searchCriteriaData["keywordDropdown"] = keywordDropdownData;
  }

  if (vendorDropdownData != null) {
    searchCriteriaData["vendorsDropdown"] = vendorDropdownData;
  }

  if (vendorDropdownData != null) {
    searchCriteriaData["methodsDropdown"] = methodDropdownData;
  }

  if (searchCriteriaData != null) {
    jsonObject["searchCriteria"] = searchCriteriaData;
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

  jsonObject.trackingConfig = populateTrackingConfigJson(trackingConfigTrackingLogos);

  return {
    configJson: JSON.stringify(jsonObject)
  };
});