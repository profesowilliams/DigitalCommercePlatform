"use strict";
use(function () {
    var itemsList = [];
    var jsonObject = new Packages.org.json.JSONObject();

    if (properties.get("cutOffValue") != null) {
        jsonObject.put("maxItems", properties.get("cutOffValue"));
    }

    jsonObject.put("endpoint", this.uiServiceDomain+this.activeCartEndpoint);


    jsonObject.put("shopUrl", this.shopDomain+this.cartURL);


    return {
        configJson: jsonObject.toString()
    };
});