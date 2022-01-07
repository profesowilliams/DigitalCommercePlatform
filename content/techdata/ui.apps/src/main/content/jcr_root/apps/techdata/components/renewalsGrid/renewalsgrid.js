"use strict";
use(['../common/utils.js'], function (utils) {
  let jsonObject = {};
  let resourceResolver = resource.getResourceResolver();
  let optionData = {};

  if (properties && properties["detailUrl"]) {
    jsonObject["detailUrl"] = properties["detailUrl"] + properties["detailUrlSuffix"];
  }

  //Column definition

  let columnListValues = utils.getDataFromMultifield(resourceResolver, "columnList", function (childResource) {
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

  jsonObject["uiServiceEndPoint"] = this.serviceData.uiServiceDomain + this.serviceData.renewalsGridEndpoint || '';

  if (this.agGridLicenseKey) {
    jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
  }
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


  return {
    configJson: JSON.stringify(jsonObject)
  };
});