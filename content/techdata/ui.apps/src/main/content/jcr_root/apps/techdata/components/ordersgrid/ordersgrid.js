"use strict";
use(function () {

    var jsonObject = {};
    var iconValues = [];
    var listValues = [];
	var labelValues = [];
    var optionData = {};
    var resourceResolver = resource.getResourceResolver();
 var invoicesModalData = {};

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


    return {
        configJson: JSON.stringify(jsonObject)
    };
});