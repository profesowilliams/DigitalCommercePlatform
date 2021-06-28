"use strict";
use(function () {
    var itemsList = [];
    var jsonObject = new Packages.org.json.JSONObject();

    if (properties.get("label") != null) {
        jsonObject.put("label", properties.get("label"));
    }

    if (this.uiServiceDomain != null) {
    jsonObject.put("endpoint", this.uiServiceDomain+this.myDealsEndpoint);
    }

    return {
        configJson: jsonObject.toString()
    };
});