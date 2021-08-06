"use strict";
use(function () {
    const HTML_EXTENSION = ".html";
    var listOfItems = [];
    var jsonObject = new Packages.org.json.JSONObject();
    var listOfItemsMap = new java.util.LinkedHashMap();
    var listValues = [];
    var resourceResolver = resource.getResourceResolver();
    var session = resourceResolver.adaptTo(Packages.javax.jcr.Session);
    var node = resourceResolver.getResource(resource.getPath() + "/itemLinks");
    var pageProps = currentPage.getContentResource();
    var parseLinkURL = function(linkURL) {
        if (linkURL) {
            linkURL = linkURL.replace("\"","");
            linkURL = linkURL.replace("\"","");

            if (linkURL.startsWith("/content") && !linkURL.endsWith(HTML_EXTENSION)) {
                return ("".concat(linkURL + ".html"));
            }

            return linkURL;
        }
        return linkURL;
    }

    if (node !== null) {
        var childrenList = node.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var linkTitle = res.properties["linkText"];
            var linkUrl = parseLinkURL(JSON.stringify(res.properties["linkUrl"]));
            var iconUrl = res.properties["iconUrl"];
            var itemData = {};
            itemData.linkTitle = linkTitle;
            itemData.linkUrl = linkUrl;
            itemData.iconUrl = iconUrl;
            listValues.push(itemData);

        }
    }

    if (pageProps) {
        var isPrivatePage = pageProps.properties["isPrivatePage"];
        if (isPrivatePage)
        {
            jsonObject.put("isPrivatePage", true);
        }else{
            jsonObject.put("isPrivatePage", false);
        }
    }else{
        jsonObject.put("isPrivatePage", false);
    }

    if (properties.get("label") != null) {
        jsonObject.put("label", properties.get("label"));
    }
    if (properties.get("authenticationURL") != null)
    {
        jsonObject.put("authenticationURL", properties.get("authenticationURL"));
    }else{
        if (this.authorizationPageURL != null) {
            jsonObject.put("authenticationURL", this.authorizationPageURL);
        }
    }

    if (properties.get("uiServiceEndPoint") != null)
    {
        jsonObject.put("uiServiceEndPoint", properties.get("uiServiceEndPoint"));
    }else{
        if (this.uiServiceDomain != null) {
            jsonObject.put("uiServiceEndPoint", this.uiServiceDomain+this.loginEndpoint);
        }
    }

    if (properties.get("clientId") != null)
    {
        jsonObject.put("clientId", properties.get("clientId"));
    }else{
        if (this.pingAppId != null) {
            jsonObject.put("clientId", this.pingAppId);
        }
    }



    if (properties.get("logoutURL") != null) {

        var logoutUrl = parseLinkURL(properties.get("logoutURL"))
        jsonObject.put("logoutURL", logoutUrl);
    }
    if (properties.get("clientId") != null) {
        jsonObject.put("clientId", properties.get("clientId"));       }

    if (properties.get("myEcIdlabel") != null) {
        jsonObject.put("myEcIdlabel", properties.get("myEcIdlabel"));
    }
    if (properties.get("myEcId") != null) {
        jsonObject.put("myEcId", properties.get("myEcId"));
    }
    if (listValues != null) {
        jsonObject.put("items", listValues);
    }

    if (this.editMode) {
        jsonObject.put("editMode", this.editMode);
    }
    return {
        listValues: jsonObject.toString()
    };
});