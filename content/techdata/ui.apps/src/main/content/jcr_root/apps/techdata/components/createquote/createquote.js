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
            var dropdownPlaceholder = res.properties["dropdownPlaceholder"];
            var textPlaceholder = res.properties["textPlaceholder"];
            var manuallyTypedError = res.properties["manuallyTypedError"];


            var itemData = {};
            itemData.label = label;
            itemData.key = optionKey;
            itemData.title = title;
            itemData.dropdownPlaceholder = dropdownPlaceholder;
            itemData.textPlaceholder = textPlaceholder;
            itemData.manuallyTypedError = manuallyTypedError;


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
     if (properties.get("pricingConditions") != null) {
         jsonObject.put("pricingConditions", properties.get("pricingConditions"));
        }
     if (properties.get("estimatedIdListEndpoint") != null) {
         jsonObject.put("estimatedIdListEndpoint", properties.get("estimatedIdListEndpoint"));
         }
      if (properties.get("estimatedIdDetailsEndpoint") != null) {
         jsonObject.put("estimatedIdDetailsEndpoint", properties.get("estimatedIdDetailsEndpoint"));
         }

    if (listValues != null) {
        jsonObject.put("optionsList", listValues);
    }
    return {
        configJson: jsonObject.toString()
    };
});