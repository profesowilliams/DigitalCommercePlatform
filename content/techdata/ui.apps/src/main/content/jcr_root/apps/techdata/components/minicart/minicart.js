"use strict";
use(function () {
    var itemsList = [];
    var jsonObject = new Packages.org.json.JSONObject();

    if (properties.get("cutOffValue") != null) {
        jsonObject.put("maxItems", properties.get("cutOffValue"));
    }

    jsonObject.put("endpoint", this.uiServiceDomain+this.savedCartsEndpoint);

    if (properties.get("shopUrl") != null) {
        jsonObject.put("shopUrl", properties.get("shopUrl"));
    }

    return {
        configJson: jsonObject.toString()
    };
});