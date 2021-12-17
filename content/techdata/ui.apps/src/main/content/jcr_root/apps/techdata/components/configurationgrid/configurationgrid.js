"use strict";
use(['../common/utils.js'], function (utils) {
  var jsonObject = {};
  var resourceResolver = resource.getResourceResolver();
  var optionData = {};
  var searchCriteriaData = {};

  if (properties && properties["configDetailUrl"]) {
    jsonObject["configDetailUrl"] = properties["configDetailUrl"] + properties["configDetailUrlSuffix"];
  }

  if (properties && properties["quoteDetailUrl"]) {
    jsonObject["quoteDetailUrl"] = properties["quoteDetailUrl"] + properties["quoteDetailUrlSuffix"];
  }

  if (properties && properties["actionColumnLabel"]) {
    jsonObject["actionColumnLabel"] = properties["actionColumnLabel"];
  }

  if (properties && properties["createQuoteUrl"]) {
    jsonObject["createQuoteUrl"] = properties["createQuoteUrl"] + properties["createQuoteUrlSuffix"];
  }

  //Modal Labels
  var quotesModal = {};

  if (properties && properties["modalTitle"]) {
    quotesModal.title = properties["modalTitle"];
  }

  if (properties && properties["modalContent"]) {
    quotesModal.content = properties["modalContent"];
  }

  if (properties && properties["modalQuotePreffixLabel"]) {
    quotesModal.quotePreffixLabel = properties["modalQuotePreffixLabel"];
  }

  jsonObject["quotesModal"] = quotesModal;

  //Column definition
  var columnListValues = [];
  var node = resourceResolver.getResource(currentNode.getPath() + "/columnList");

  if (node !== null) {
    var childrenList = node.getChildren();

    for (var [key, res] in Iterator(childrenList)) {
      var itemData = {};

      itemData.columnLabel = res.properties["columnLabel"];
      itemData.columnKey = res.properties["columnKey"];
      itemData.sortable = res.properties["sortable"];

      columnListValues.push(itemData);
    }
  }

  if (columnListValues != null) {
    jsonObject["columnList"] = columnListValues;
  }

  var keywordDropdownData = {};

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

  var configurationTypesDropdownData = {};

  if (properties && properties["configurationTypesDropdownLabel"]) {
    configurationTypesDropdownData.label = properties["configurationTypesDropdownLabel"] || "";
  }

  var configurationTypesListNode = resourceResolver.getResource(currentNode.getPath() + "/configurationTypesList");

  if (configurationTypesListNode !== null) {
    var childrenList = configurationTypesListNode.getChildren();
    var configurationTypesValues = [];
    for (var [key, res] in Iterator(childrenList)) {
      var labelKey = res.properties["configurationTypesKey"];
      var labelValue = res.properties["configurationTypesValue"];
      var labelData = {};
      labelData.key = labelKey;
      labelData.value = labelValue;
      configurationTypesValues.push(labelData);
      configurationTypesDropdownData.items = configurationTypesValues;
    }
  }

  //Get Status Labels (Pending, Multiple,...)
  var statusLabelsListValues = [];
  var statusLabelsListNode = resourceResolver.getResource(currentNode.getPath() + "/statusLabelsList");

  if (statusLabelsListNode !== null) {
    var childrenList = statusLabelsListNode.getChildren();

    for (var [key, res] in Iterator(childrenList)) {
      var labelData = {};

      labelData.labelKey = res.properties["labelKey"];
      labelData.labelValue = res.properties["labelValue"];
      labelData.labelDescription = res.properties["labelDescription"];
      labelData.buttonIcon = res.properties["buttonIcon"];
      labelData.buttonLabel = res.properties["buttonLabel"];

      statusLabelsListValues.push(labelData);
    }
  }

  if (statusLabelsListValues != null) {
    jsonObject["statusLabelsList"] = statusLabelsListValues;
  }

  jsonObject["uiServiceEndPoint"] = this.serviceData.uiServiceDomain + this.serviceData.configurationsEndpoint || '';
  jsonObject["agGridLicenseKey"] = this.serviceData.agGridLicenseKey || '';

  if (properties && properties["itemsPerPage"]) {
    jsonObject["itemsPerPage"] = properties["itemsPerPage"];
  }
  if (properties && properties["paginationStyle"]) {
    jsonObject["paginationStyle"] = properties["paginationStyle"];
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
  if (keywordDropdownData != null) {
    searchCriteriaData["keywordDropdown"] = keywordDropdownData;
  }

  if (configurationTypesDropdownData != null) {
    searchCriteriaData["configurationTypesDropdown"] = configurationTypesDropdownData;
  }

  if (searchCriteriaData != null) {
    jsonObject["searchCriteria"] = searchCriteriaData;
  }

  return {
    configJson: JSON.stringify(jsonObject)
  };
});
