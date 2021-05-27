"use strict";
use(function () {

    var jsonObject = {};

    var listValues = [];
    var iconValues = [];
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

    var iconListNode = resourceResolver.getResource(currentNode.getPath() + "/iconList");

    if (iconListNode !== null) {
        var childrenList = iconListNode.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var iconKey = res.properties["iconKey"];
            var iconValue = res.properties["iconValue"];
            var itemData = {};
            itemData.iconKey = iconKey;
            itemData.iconValue = iconValue;
            iconValues.push(itemData);

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
    return {
        configJson: JSON.stringify(jsonObject)
    };
});