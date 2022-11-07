"use strict";
use(function () {
    var itemsList = [];
    var jsonObject = new Packages.org.json.JSONObject();

    if (properties.get("cutOffValue") != null) {
        jsonObject.put("maxItems", properties.get("cutOffValue"));
    }

    if (properties.get("endpoint") != null) {
        jsonObject.put("endpoint", properties.get("endpoint"));
    }else{
        jsonObject.put("endpoint", this.uiServiceDomain+this.activeCartEndpoint);
    }

    if (properties.get("shopUrl") != null) {
        jsonObject.put("shopUrl", properties.get("shopUrl"));
    }else{
        jsonObject.put("shopUrl", this.shopDomain+this.cartURL);
    }

    if (properties.get("cartLabel") != null) {
        jsonObject.put("cartLabel", properties.get("cartLabel"));
    }

    return {
        configJson: jsonObject.toString()
    };
});