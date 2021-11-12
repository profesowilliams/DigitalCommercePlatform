"use strict";
use(function () {
    function getDataFromMultifield (resourceResolver, multifieldPropertyName, populateFieldsCallback) {
        var columnListValues = null;

        var node = resourceResolver.getResource(currentNode.getPath() + "/" + multifieldPropertyName);

        if (node !== null) {
            columnListValues = [];
            var childrenList = node.getChildren();
        
            for (var [key, childResource] in Iterator(childrenList)) {
                columnListValues.push(populateFieldsCallback(childResource));
            }
        }

        return columnListValues;
    }
    function populateCommonConfigurations (targetObject, serviceData) {
        if (serviceData["productEmptyImageUrl"]) {
            targetObject["productEmptyImageUrl"] = serviceData["productEmptyImageUrl"];
        }
    }
    return {
        getDataFromMultifield: getDataFromMultifield,
        populateCommonConfigurations: populateCommonConfigurations
    }
});