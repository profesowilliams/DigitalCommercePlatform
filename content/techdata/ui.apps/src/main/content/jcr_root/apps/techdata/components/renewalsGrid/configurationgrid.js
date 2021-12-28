"use strict";
use(['../common/utils.js'], function(utils) {
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

    jsonObject["uiServiceEndPoint"] = this.serviceData.uiServiceDomain + this.serviceData.renewalsGridEndpoint || '';

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

    if (optionData != null) {
        jsonObject["options"] = optionData;
    }

    if (properties && properties["filterTitle"]) {
        jsonObject["filterTitle"] = properties["filterTitle"];
    }

    if (properties && properties["clearAllFilterTitle"]) {
        jsonObject["clearAllFilterTitle"] = properties["clearAllFilterTitle"];
    }

    if (properties && properties["showResultLabel"]) {
        jsonObject["showResultLabel"] = properties["showResultLabel"];
    }


    var resourceResolver = resource.getResourceResolver();
    var node = resourceResolver.getResource(currentNode.getPath() + "/filterList");
    var filterListValues = [];
    if (node !== null) {
        var childrenList = node.getChildren();
        for (var [key, res] in Iterator(childrenList)) {
            var accordionLabel = res.properties["accordionLabel"];
            const filterField = res.properties["filterField"];
            var itemData = {};
            itemData.accordionLabel = accordionLabel;
            itemData.filterField = filterField;
            var childNode = resourceResolver.getResource(res.getPath() + '/filtersOptionsList');

            if (childNode != null) {
                itemData.filterOptionsValues = [];
                var childNodeList = childNode.getChildren();
                for (var [childkey, childRes] in Iterator(childNodeList)) {
                    var childDataItem = {};
                    var filterOptionLabel = childRes.properties["filterOptionLabel"];
                    childDataItem.filterOptionLabel = filterOptionLabel;
                    var subChildNode = resourceResolver.getResource(childRes.getPath() + '/subFilterOptionList');

                    if (subChildNode != null) {
                        var subFilterOptionsValues = [];
                        var subChildNodeList = subChildNode.getChildren();

                        for (var [subChildKey, subChildRes] in Iterator(subChildNodeList)) {
                            var subChildDataItem = {};
                            subChildDataItem.subFilterOptionsLabel = subChildRes.properties["subFilterOptionsLabel"];
                            subFilterOptionsValues.push(subChildDataItem);
                        }
                        childDataItem.subFilterOptionsValues = subFilterOptionsValues;
                    }
                    itemData.filterOptionsValues.push(childDataItem);
                }
            }
            filterListValues.push(itemData);
        }
    }

    if (filterListValues != null) {
        jsonObject['filterListValues'] = filterListValues;
    }


    return {
        configJson: JSON.stringify(jsonObject)
    };
});