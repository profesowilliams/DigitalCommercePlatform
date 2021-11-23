"use strict";
use(function() {
    var itemsList = [];
    var jsonObject = {};
    var vendorConnectionsModalObject = {};
    var iconValues = [];
    var primaryMenuArray = [];
    var dashboardMenuArray = [];

    function sanitizeURL(url) {
        if (url.startsWith("http")) {
            return url;
        } else if (url.startsWith("/content")) {
            return url + ".html";
        }
    }

    var resourceResolver = resource.getResourceResolver();

    jsonObject["minified"] = "true";

    if (properties && properties["accountNumber"]) {
        jsonObject["accountnumberLabel"] = properties["accountNumber"];
    }

    if (properties && properties["toolsIndex"]) {
        jsonObject["toolsIndex"] = properties["toolsIndex"] || 2;
    } else {
        jsonObject["toolsIndex"] = "2";
    }

    if (this.uiServiceDomain != null && this.vendorConnectionEndpoint != null) {
        vendorConnectionsModalObject["getConnectionsEndPoint"] = this.uiServiceDomain + this.vendorConnectionEndpoint;
    }

    if (this.vendorConnectionEndpoint != null && this.setVendorConnectionEndpoint != null) {
        vendorConnectionsModalObject["setConnectionsEndPoint"] = this.uiServiceDomain + this.setVendorConnectionEndpoint;
    }

    if (properties && properties["loginPageCommonName"]) {
        vendorConnectionsModalObject["loginPageCommonName"] = properties["loginPageCommonName"] || 'vendorlogin';
    } else {
        vendorConnectionsModalObject["loginPageCommonName"] = "vendorlogin";
    }

    if (properties && properties["vendorSignInCodeParameter"]) {
        vendorConnectionsModalObject["vendorSignInCodeParameter"] = properties["vendorSignInCodeParameter"] || 'code';
    } else {
        vendorConnectionsModalObject["vendorSignInCodeParameter"] = "code";
    }

    if (properties && properties["title"]) {
        vendorConnectionsModalObject["title"] = properties["title"];
    }

    if (properties && properties["buttonLabel"]) {
        vendorConnectionsModalObject["buttonLabel"] = properties["buttonLabel"];
    }

    if (properties && properties["buttonIcon"]) {
        vendorConnectionsModalObject["buttonIcon"] = properties["buttonIcon"];
    }

    if (properties && properties["content"]) {
        vendorConnectionsModalObject["content"] = properties["content"];
    }

    if (properties && properties["connectedLabel"]) {
        vendorConnectionsModalObject["connectedLabel"] = properties["connectedLabel"];
    }

    if (properties && properties["disconnectedLabel"]) {
        vendorConnectionsModalObject["disconnectedLabel"] = properties["disconnectedLabel"];
    }


    var node = resourceResolver.getResource(currentNode.getPath() + "/iconsList");

    if (node !== null) {
        var childrenList = node.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var key = res.properties["key"];
            var iconPath = res.properties["iconPath"];
            var logInUrl = res.properties["logInUrl"];
            var connectLandingPage = res.properties["connectLandingPage"];
            var itemData = {};
            itemData.key = key;
            itemData.value = iconPath;
            itemData.logInUrl = logInUrl;
            itemData.connectLandingPage = connectLandingPage;
            iconValues.push(itemData);
        }
    }

    var primaryMenuParentNode = resourceResolver.getResource(currentNode.getPath() + "/primaryMenus");

    if (primaryMenuParentNode !== null) {
        var childrenList = primaryMenuParentNode.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var label = res.properties["primaryLabel"];
            var link = res.properties["primaryLink"];
            var legacyLink = res.properties["legacyLink"];
            var itemData = {};
            itemData.title = label;
            itemData.link = link;
            itemData.legacyLink = legacyLink;
            primaryMenuArray.push(itemData);
        }
    }

    var dashboardMenuParentNode = resourceResolver.getResource(currentNode.getPath() + "/dashboardMenus");

    if (dashboardMenuParentNode !== null) {
        var childrenList = dashboardMenuParentNode.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var label = res.properties["dashboardItemLabel"];
            var link = sanitizeURL(res.properties["dashboardLink"]);
            var imagePath = res.properties["dashboardImagePath"];
            var itemData = {};
            itemData.title = label;
            itemData.imagePath = imagePath;
            itemData.link = link;
            dashboardMenuArray.push(itemData);
        }
    }

    if (iconValues != null) {
        vendorConnectionsModalObject["vendors"] = iconValues;
    }

    if (primaryMenuArray != null) {
        jsonObject["menuItems"] = primaryMenuArray;
    }

    if (dashboardMenuArray != null) {
        jsonObject["dashboardMenuItems"] = dashboardMenuArray;
    }

    if (vendorConnectionsModalObject != null) {
        jsonObject["vendorConnectionsModal"] = vendorConnectionsModalObject;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});