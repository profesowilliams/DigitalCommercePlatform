"use strict";
use(function () {

    var jsonObject = {};
    var iconValues = [];
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
    if (properties && properties["orderDetailUrl"]) {
        jsonObject["orderDetailUrl"] = properties["orderDetailUrl"];
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

    if (iconValues != null) {
        jsonObject["iconList"] = iconValues;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});