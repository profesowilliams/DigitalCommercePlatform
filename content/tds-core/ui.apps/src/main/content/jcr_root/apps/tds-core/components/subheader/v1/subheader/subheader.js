"use strict";
use(function () {
    var itemsList = [];
    var jsonObject = {};
    var vendorConnectionsModalObject = {};
    var iconValues = [];
	var resourceResolver = resource.getResourceResolver();

	jsonObject["minified"] = "true";


	 if (properties && properties["accountNumber"]) {
        jsonObject["accountnumberLabel"] = properties["accountNumber"];
    }
    if (this.uiServiceDomain != null) {
    vendorConnectionsModalObject["uiServiceEndPoint"] = this.uiServiceDomain+this.vendorConnectionEndpoint;
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
            var itemData = {};
            itemData.key = key;
            itemData.value = iconPath;
            itemData.logInUrl = logInUrl;
            iconValues.push(itemData);

        }
    }
    if (iconValues != null) {
            vendorConnectionsModalObject["vendors"] = iconValues;
        }

    if (vendorConnectionsModalObject != null) {
            jsonObject["vendorConnectionsModal"] = vendorConnectionsModalObject;
        }



    return {
        configJson: JSON.stringify(jsonObject)
    };
});