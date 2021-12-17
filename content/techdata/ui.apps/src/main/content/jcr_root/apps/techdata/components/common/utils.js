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
        if (serviceData["noRowsErrorMessage"]) {
            targetObject["noRowsErrorMessage"] = serviceData["noRowsErrorMessage"];
        }
        if (serviceData["errorGettingDataMessage500"]) {
            targetObject["errorGettingDataMessage500"] = serviceData["errorGettingDataMessage500"];
        }
        if (serviceData["errorGettingDataMessage401"]) {
            targetObject["errorGettingDataMessage401"] = serviceData["errorGettingDataMessage401"];
        }
        if (serviceData["errorGettingDataMessage403"]) {
            targetObject["errorGettingDataMessage403"] = serviceData["errorGettingDataMessage403"];
        }
        if (serviceData["errorGettingDataMessage404"]) {
            targetObject["errorGettingDataMessage404"] = serviceData["errorGettingDataMessage404"];
        }
        if (serviceData["errorGettingDataMessage408"]) {
            targetObject["errorGettingDataMessage408"] = serviceData["errorGettingDataMessage408"];
        }
        if (serviceData['productEmptyImageUrl']) {
            targetObject['productEmptyImageUrl'] = serviceData['productEmptyImageUrl'];
        }
        if (serviceData['agGridLicenseKey']) {
            targetObject['agGridLicenseKey'] = serviceData['agGridLicenseKey'];
        }
    }
    function getCheckoutConfigurations (serviceData) {
        var checkoutConfigurations = {};

        if (serviceData.replaceCartEndpoint != null) {
            checkoutConfigurations.uiServiceEndPoint = serviceData.uiServiceDomain+serviceData.replaceCartEndpoint;
        }
    
        if (serviceData.shopDomain != null) {
            checkoutConfigurations.redirectUrl = serviceData.shopDomain+serviceData.cartURL;
        }

        return checkoutConfigurations;
    }
    return {
        getDataFromMultifield: getDataFromMultifield,
        populateCommonConfigurations: populateCommonConfigurations,
        getCheckoutConfigurations: getCheckoutConfigurations
    }
});