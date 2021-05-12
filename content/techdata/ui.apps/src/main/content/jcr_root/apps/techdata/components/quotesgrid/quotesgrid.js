"use strict";
use(function () {

    var jsonObject = {};

    var listValues = [];
    var optionData = {};
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
    if (properties && properties["label"]) {
        jsonObject["label"] = properties["label"];
    }

    if (properties && properties["uiServiceEndPoint"]) {
        jsonObject["uiServiceEndPoint"] = properties["uiServiceEndPoint"];
    }
    if (properties && properties["itemsPerPage"]) {
        jsonObject["itemsPerPage"]= properties["itemsPerPage"];
    }
    if (properties && properties["paginationStyle"]) {
        jsonObject["paginationStyle"] = properties["paginationStyle"];
    }
    if (properties && properties["quoteDetailUrl"]) {
        jsonObject["quoteDetailUrl"] = properties["quoteDetailUrl"];
    }
    if (properties && properties["defaultSortingColumnKey"]) {
        optionData.defaultSortingColumnKey = properties["defaultSortingColumnKey"];
    }
    if (properties && properties["defaultSortingDirection"]) {
        optionData.defaultSortingDirection = properties["defaultSortingDirection"];
    }


    if (listValues != null) {
        jsonObject["columnList"] = listValues;
    }
    if (optionData != null) {
        jsonObject["options"] = optionData;
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});