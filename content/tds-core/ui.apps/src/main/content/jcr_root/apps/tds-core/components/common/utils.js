'use strict';
use(function () {
    const PARENT_FOLDER_LEVEL = 4;
    const FOLDER_SEPARATOR = "/";
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

        if (componentData.checkoutRedirectUrl != null) {
            checkoutConfigurations.checkoutRedirectUrl = serviceData.shopDomain + componentData.checkoutRedirectUrl;
        }

        return checkoutConfigurations;
    }
    function fillFieldsDialogProperties(fieldList){
        const fieldObject = {};
        for (let field of fieldList){
            if (properties[field]) {fieldObject[field] = properties[field]};
        }
        return fieldObject;
    }
    function fillFieldsDialogPropertiesWithPrefix(fieldList, prefix){
        const fieldObject = {};
        for (let field of fieldList){
            if (properties[prefix + field]) {fieldObject[field] = properties[prefix + field]};
        }
        return fieldObject;
    }
    function populateOutterProperty (obj, property, fieldList) {
        const populated = fillFieldsDialogProperties(fieldList);
        if (populated) {obj[property] = populated};
    }
    function addHtmlIfNeeded(url) {
        if (url && !url.includes('https:') && !url.includes('http:') && !url.includes('www.') && !url.includes('.html')) {
            url = url + '.html';
        }
        return url;
    }
    function transformUrlGivenEnvironment(url) {
        let runModes = sling
            .getService(Packages.org.apache.sling.settings.SlingSettingsService)
            .getRunModes();

        let isEnvWithDispatcher =
            !(runModes.contains("sit") || runModes.contains("dit"));

        let currentPageParentPath = currentPage.getPath().split(FOLDER_SEPARATOR).slice(0, PARENT_FOLDER_LEVEL).join(FOLDER_SEPARATOR);

        let detailUrl = url;

        //UAT, Stage, Prod
        if (isEnvWithDispatcher && url && url.replace) {
            detailUrl = url.replace(currentPageParentPath, "");
        }

        return detailUrl;
    }
    return {
        getDataFromMultifield: getDataFromMultifield,
        populateCommonConfigurations: populateCommonConfigurations,
        getCheckoutConfigurations: getCheckoutConfigurations,
        fillFieldsDialogProperties:fillFieldsDialogProperties,
        fillFieldsDialogPropertiesWithPrefix:fillFieldsDialogPropertiesWithPrefix,
        populateOutterProperty:populateOutterProperty,
        addHtmlIfNeeded: addHtmlIfNeeded,
        transformUrlGivenEnvironment: transformUrlGivenEnvironment
    }
});