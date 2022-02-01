'use strict';
use(function () {
    function getDataFromMultifield (resourceResolver, multifieldPropertyName, populateFieldsCallback) {
        var columnListValues = null;

        var node = resourceResolver.getResource(currentNode.getPath() + '/' + multifieldPropertyName);

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
        if (serviceData['productEmptyImageUrl']) {
            targetObject['productEmptyImageUrl'] = serviceData['productEmptyImageUrl'];
        }
        if (serviceData['agGridLicenseKey']) {
            targetObject['agGridLicenseKey'] = serviceData['agGridLicenseKey'];
        }
    }
    function getCheckoutConfigurations (serviceData, componentData) {
        var checkoutConfigurations = {};

        if (serviceData.replaceCartEndpoint != null) {
            checkoutConfigurations.uiServiceEndPoint = serviceData.uiServiceDomain+serviceData.replaceCartEndpoint;
        }
    
        if (serviceData.shopDomain != null) {
            checkoutConfigurations.redirectUrl = serviceData.shopDomain+serviceData.cartURL;
        }

        if (componentData.expressCheckoutRedirectUrl != null) {
            checkoutConfigurations.expressCheckoutRedirectUrl = serviceData.shopDomain+componentData.expressCheckoutRedirectUrl;
        }

        return checkoutConfigurations;
    }
    return {
        getDataFromMultifield: getDataFromMultifield,
        populateCommonConfigurations: populateCommonConfigurations,
        getCheckoutConfigurations: getCheckoutConfigurations
    }
});