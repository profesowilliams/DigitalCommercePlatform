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

    if (properties.get("buttonTitle") != null) {
        jsonObject.put("buttonTitle", properties.get("buttonTitle"));
    }
    if (properties.get("buttonTitleInProgress") != null) {
        jsonObject.put("buttonTitleInProgress", properties.get("buttonTitleInProgress"));
    }
    if (properties.get("createQuoteInProgress") != null) {
        jsonObject.put("createQuoteInProgress", properties.get("createQuoteInProgress"));
    }
    if (properties.get("createQuoteError") != null) {
        jsonObject.put("createQuoteError", properties.get("createQuoteError"));
    }

    if (properties.get("quotePreviewUrl") != null) {
        jsonObject.put("quotePreviewUrl", properties.get("quotePreviewUrl"));
    }

    if (properties.get("quotesGridUrl") != null) {
        jsonObject.put("quotesGridUrl", properties.get("quotesGridUrl"));
    }

     if (this.uiServiceDomain != null) {
        jsonObject.put("endpoint", this.uiServiceDomain+this.createQuoteEndpoint);
        jsonObject.put("cartslistEndpoint", this.uiServiceDomain+this.savedCartsEndpoint);
        jsonObject.put("cartdetailsEndpoint", this.uiServiceDomain+this.cartDetailsEndpoint);
        jsonObject.put("pricingConditions", this.uiServiceDomain+this.pricingConditionsEndPoint);
        jsonObject.put("estimatedIdListEndpoint", this.uiServiceDomain+this.estimatedIdListEndpoint);
        jsonObject.put("estimatedIdDetailsEndpoint", this.uiServiceDomain+this.estimatedIdDetailsEndpoint);
        }


    if (listValues != null) {
        jsonObject.put("optionsList", listValues);
    }
    return {
        configJson: jsonObject.toString()
    };
});