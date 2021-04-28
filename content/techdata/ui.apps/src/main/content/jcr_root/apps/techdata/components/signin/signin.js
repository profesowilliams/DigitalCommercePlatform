"use strict";
use(function () {
    var listOfItems = [];
    var jsonObject = new Packages.org.json.JSONObject();
    var listOfItemsMap = new java.util.LinkedHashMap();
    var listValues = [];
    var resourceResolver = resource.getResourceResolver();
    var session = resourceResolver.adaptTo(Packages.javax.jcr.Session);
    var node = resourceResolver.getResource(currentNode.getPath() + "/itemLinks");

    if (node !== null) {
        var childrenList = node.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var linkTitle = res.properties["linkText"];
            var linkUrl = res.properties["linkUrl"];
            var iconUrl = res.properties["iconUrl"];
            var itemData = {};
            itemData.linkTitle = linkTitle;
            itemData.linkUrl = linkUrl;
            itemData.iconUrl = iconUrl;
            listValues.push(itemData);

        }
    }
    if (properties.get("label") != null) {
        jsonObject.put("label", properties.get("label"));
    }
    if (properties.get("authenticationURL") != null) {
        jsonObject.put("authenticationURL", properties.get("authenticationURL"));
    }
    if (properties.get("uiServiceEndPoint") != null) {
        jsonObject.put("uiServiceEndPoint", properties.get("uiServiceEndPoint"));
    }
    if (properties.get("clientId") != null) {
        jsonObject.put("clientId", properties.get("clientId"));
    }
    if (properties.get("myEcIdlabel") != null) {
        jsonObject.put("myEcIdlabel", properties.get("myEcIdlabel"));
    }
    if (properties.get("myEcId") != null) {
        jsonObject.put("myEcId", properties.get("myEcId"));
    }
    if (listValues != null) {
        jsonObject.put("items", listValues);
    }
    return {
        listValues: jsonObject.toString()
    };
});