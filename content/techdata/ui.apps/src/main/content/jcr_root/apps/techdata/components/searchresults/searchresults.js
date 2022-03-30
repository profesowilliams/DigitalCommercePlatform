"use strict";
use(function () {
    var jsonObject = new Packages.org.json.JSONObject();

    if (properties.get("label") != null) {
        jsonObject.put("label", properties.get("label"));
    }

    if (properties.get("baseHref") != null) {
        jsonObject.put("baseHref", properties.get("baseHref"));
    }

    if (properties.get("loginPath") != null) {
        jsonObject.put("loginPath", properties.get("loginPath"));
    }

    if (properties.get("uiSearchBaseUrl") != null) {
        jsonObject.put("uiSearchBaseUrl", this.uiServiceDomain + properties.get("uiSearchBaseUrl"));
    }

    if (properties.get("uiBrowseBaseUrl") != null) {
        jsonObject.put("uiBrowseBaseUrl", this.uiServiceDomain + properties.get("uiBrowseBaseUrl"));
    }

    if (properties.get("uiLocalizeBaseUrl") != null) {
        jsonObject.put("uiLocalizeBaseUrl", this.uiServiceDomain + properties.get("uiLocalizeBaseUrl"));
    }

    if (properties.get("loginRedirectUrlQueryParameter") != null) {
        jsonObject.put("loginRedirectUrlQueryParameter", this.uiServiceDomain + properties.get("loginRedirectUrlQueryParameter"));
    }

    return {
        configJson: jsonObject.toString()
    };
});