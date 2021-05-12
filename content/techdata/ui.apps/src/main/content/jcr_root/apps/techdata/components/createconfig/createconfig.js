"use strict";
use(function () {

    var jsonObject = new Packages.org.json.JSONObject();
    var listValues = [];
    var resourceResolver = resource.getResourceResolver();
    var node = resourceResolver.getResource(currentNode.getPath() + "/VendorList");

    if (node !== null) {
        var childrenList = node.getChildren();
        for (var [key, res] in Iterator(childrenList)) {
            var vendorLabel = res.properties["vendorLabel"];
            var internalUrl = res.properties["internalUrl"];
            var externalUrl = res.properties["externalUrl"];
            var extendedOption = res.properties["extendedOption"];
            var itemData = {};
            itemData.vendorLabel = vendorLabel;
            itemData.internalUrl = internalUrl;
            itemData.extendedOption = extendedOption;
            itemData.externalUrl = externalUrl;

            itemData.extendedOptionList = [];
            var childNode = resourceResolver.getResource(res.getPath() + '/extendedOptionList');
            if(childNode != null){
                var childNodeList = childNode.getChildren();
                for (var [childkey, childRes] in Iterator(childNodeList)) {
                    var itemDataChild = {};
                    var extendedItemLabel = childRes.properties["extendedItemLabel"];
                    var extendedInternalUrl = childRes.properties["extendedInternalUrl"];
                    var extendedExternalUrl = childRes.properties["extendedExternalUrl"];
                    itemDataChild.extendedItemLabel = extendedItemLabel;
                    itemDataChild.extendedInternalUrl = extendedInternalUrl;
                    itemDataChild.extendedExternalUrl = extendedExternalUrl;
                    itemData.extendedOptionList.push(itemDataChild);
                }
            }
            listValues.push(itemData);
        }
    }
    if (properties.get("createConfigTitle") != null) {
        jsonObject.put("createConfigTitle", properties.get("createConfigTitle"));
    }

    if (properties.get("placeholderText") != null) {
        jsonObject.put("placeholderText", properties.get("placeholderText"));
    }

    if (properties.get("buttonLabel") != null) {
        jsonObject.put("buttonLabel", properties.get("buttonLabel"));
    }

    if (listValues != null) {
        jsonObject.put("VendorsList", listValues);
    }
    return {
        configJson: jsonObject.toString()
    };
});