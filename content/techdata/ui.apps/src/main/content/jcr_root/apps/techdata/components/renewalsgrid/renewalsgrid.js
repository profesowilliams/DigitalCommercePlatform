"use strict";
use(['../common/utils.js'], function(utils) {
    let jsonObject = {};
    let resourceResolver = resource.getResourceResolver();
    let optionData = {};
    var productGrid = {};

    if (properties && properties["detailUrl"]) {
        jsonObject["detailUrl"] = properties["detailUrl"];
    }

    //Column definition

    let columnListValues = utils.getDataFromMultifield(resourceResolver, "columnList", function(childResource) {
        let itemData = {};

        itemData.columnLabel = childResource.properties["columnLabel"];
        itemData.columnKey = childResource.properties["columnKey"];
        itemData.sortable = childResource.properties["sortable"];
        itemData.type = childResource.properties["columnType"];

        return itemData;
    });

    if (columnListValues != null) {
        jsonObject["columnList"] = columnListValues;
    }

    //Search Options
    let searchOptionsValues = utils.getDataFromMultifield(resourceResolver, "searchOptionsList", function(childResource) {
        let itemData = {};
        itemData.searchLabel = childResource.properties["searchLabel"];
        itemData.searchKey = childResource.properties["searchKey"];
        itemData.showIfIsHouseAccount = childResource.properties["showIfIsHouseAccount"];
        return itemData;
    });

    if (searchOptionsValues != null) {
        jsonObject["searchOptionsList"] = searchOptionsValues;
    }
    jsonObject["uiServiceEndPoint"] = this.serviceData.uiServiceDomain + this.serviceData.renewalsGridEndpoint || '';

    if (this.agGridLicenseKey) {
        jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
    }
    if (properties && properties["itemsPerPage"]) {
        jsonObject["itemsPerPage"] = properties["itemsPerPage"];
    }
    if (properties && properties["shopPath"] && this.shopDomainPage ) {
        jsonObject["shopURL"] = this.shopDomainPage + properties["shopPath"];
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

    if (properties && properties["ofTextLabel"]) {
        jsonObject["ofTextLabel"] = properties["ofTextLabel"];
    }

    if (properties && properties["filterType"]) {
        jsonObject["filterType"] = properties["filterType"];
    }

    let node = resourceResolver.getResource(currentNode.getPath() + "/filterList");
    let filterListValues = [];
    if (node !== null) {
        let childrenList = node.getChildren();
        for (let [key, res] in Iterator(childrenList)) {
            let accordionLabel = res.properties["accordionLabel"];
            let filterField = res.properties["filterField"];
            let itemData = {};
            itemData.accordionLabel = accordionLabel;
            itemData.filterField = filterField;
            let childNode = resourceResolver.getResource(res.getPath() + '/filtersOptionsList');

            if (childNode != null) {
                itemData.filterOptionsValues = [];
                let childNodeList = childNode.getChildren();
                for (let [childkey, childRes] in Iterator(childNodeList)) {
                    let childDataItem = {};
                    let filterOptionLabel = childRes.properties["filterOptionLabel"];
                    childDataItem.filterOptionLabel = filterOptionLabel;
                    let subChildNode = resourceResolver.getResource(childRes.getPath() + '/subFilterOptionList');

                    if (subChildNode != null) {
                        let subFilterOptionsValues = [];
                        let subChildNodeList = subChildNode.getChildren();

                        for (let [subChildKey, subChildRes] in Iterator(subChildNodeList)) {
                            let subChildDataItem = {};
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

    if (properties && properties["quoteIdLabel"]) {
        productGrid["quoteIdLabel"] = properties["quoteIdLabel"];
    }

    if (properties && properties["refNoLabel"]) {
        productGrid["refNoLabel"] = properties["refNoLabel"];
    }

    if (properties && properties["expiryDateLabel"]) {
        productGrid["expiryDateLabel"] = properties["expiryDateLabel"];
    }

    if (properties && properties["downloadPDFLabel"]) {
        productGrid["downloadPDFLabel"] = properties["downloadPDFLabel"];
    }

    if (properties && properties["downloadXLSLabel"]) {
        productGrid["downloadXLSLabel"] = properties["downloadXLSLabel"];
    }

    if (properties && properties["seeDetailsLabel"]) {
        productGrid["seeDetailsLabel"] = properties["seeDetailsLabel"];
    }

    if (productGrid != null) {
        jsonObject["productGrid"] = productGrid;
    }

    if (this.exportXLSRenewalsEndpoint != null && this.serviceData.uiServiceDomain) {
        jsonObject["exportXLSRenewalsEndpoint"] = this.serviceData.uiServiceDomain + this.exportXLSRenewalsEndpoint;
    }

    if (this.renewalDetailsEndpoint && this.serviceData.uiServiceDomain) {
        jsonObject["renewalDetailsEndpoint"] = this.serviceData.uiServiceDomain + this.renewalDetailsEndpoint;
    }


    return {
        configJson: JSON.stringify(jsonObject)
    };
});