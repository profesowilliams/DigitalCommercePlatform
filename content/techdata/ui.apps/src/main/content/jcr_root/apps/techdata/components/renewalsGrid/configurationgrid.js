"use strict";
use(['../common/utils.js'], function (utils) {
  var jsonObject = {};
  var resourceResolver = resource.getResourceResolver();
    var optionData = {};

  if (properties && properties["detailUrl"]) {
    jsonObject["detailUrl"] = properties["detailUrl"] + properties["detailUrlSuffix"];
  }

  //Column definition

  var columnListValues = utils.getDataFromMultifield(resourceResolver, "columnList", function(childResource) {
    var itemData = {};

    itemData.columnLabel = childResource.properties["columnLabel"];
    itemData.columnKey = childResource.properties["columnKey"];
    itemData.sortable = childResource.properties["sortable"];
    itemData.type = childResource.properties["columnType"];

    return itemData;
  });

    if (columnListValues != null) {
      jsonObject["columnList"] = columnListValues;
    }

    jsonObject["uiServiceEndPoint"] = this.serviceData.uiServiceDomain+this.serviceData.configurationsEndpoint || '';

    if (properties && properties["itemsPerPage"]) {
        jsonObject["itemsPerPage"]= properties["itemsPerPage"];
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

    if (optionData != null) {
        jsonObject["options"] = optionData;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});
