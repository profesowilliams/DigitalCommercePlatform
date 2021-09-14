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
            var extendedOption = res.properties["extendedOption"];
            var itemData = {};
            itemData.label = vendorLabel;
            itemData.url = internalUrl;
            itemData.extendedOption = extendedOption;

            if(extendedOption == "true"){
                itemData.urls = [];
                var childNode = resourceResolver.getResource(res.getPath() + '/extendedOptionList');
                if(childNode != null){
                    var childNodeList = childNode.getChildren();
                    for (var [childkey, childRes] in Iterator(childNodeList)) {
                        var itemDataChild = {};
                        var extendedItemLabel = childRes.properties["extendedItemLabel"];
                        var extendedUrl = childRes.properties["extendedUrl"];
                        itemDataChild.label = extendedItemLabel;
                        itemDataChild.url = extendedUrl;
                        itemData.urls.push(itemDataChild);
                    }
                }
            }
            listValues.push(itemData);
        }
    }
    if (this.uiServiceDomain != null) {
        jsonObject.put("punchOutUrl",this.uiServiceDomain+this.puchOutEndpoint);

    }
    if (properties.get("createConfigTitle") != null) {
        jsonObject.put("label", properties.get("createConfigTitle"));
    }

    if (properties.get("placeholderText") != null) {
        jsonObject.put("placeholderText", properties.get("placeholderText"));
    }

    if (properties.get("buttonLabel") != null) {
        jsonObject.put("buttonTitle", properties.get("buttonLabel"));
    }

    if (listValues != null) {
        jsonObject.put("optionsList", listValues);
    }
    return {
        configJson: jsonObject.toString()
    };
});