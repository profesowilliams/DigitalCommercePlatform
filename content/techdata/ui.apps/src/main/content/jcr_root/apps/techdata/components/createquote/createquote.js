"use strict";
use(function () {

    var jsonObject = new Packages.org.json.JSONObject();
    var listValues = [];
    var resourceResolver = resource.getResourceResolver();
    var node = resourceResolver.getResource(currentNode.getPath() + "/optionsList");

    if (node !== null) {
        var childrenList = node.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var label = res.properties["label"];
            var optionKey = res.properties["key"];
            var title = res.properties["title"];
            var itemData = {};
            itemData.label = label;
            itemData.key = optionKey;
            itemData.title = title;
            listValues.push(itemData);
        }
    }
    if (properties.get("label") != null) {
        jsonObject.put("label", properties.get("label"));
    }

    if (properties.get("endpoint") != null) {
        jsonObject.put("endpoint", properties.get("endpoint"));
    }

    if (properties.get("buttonTitle") != null) {
        jsonObject.put("buttonTitle", properties.get("buttonTitle"));
    }

    if (properties.get("quotePreviewUrl") != null) {
        jsonObject.put("quotePreviewUrl", properties.get("quotePreviewUrl"));
    }
    if (properties.get("cartslistEndpoint") != null) {
        jsonObject.put("cartslistEndpoint", properties.get("cartslistEndpoint"));
    }
    if (properties.get("cartdetailsEndpoint") != null) {
        jsonObject.put("cartdetailsEndpoint", properties.get("cartdetailsEndpoint"));
    }

    if (listValues != null) {
        jsonObject.put("optionsList", listValues);
    }
    return {
        configJson: jsonObject.toString()
    };
});