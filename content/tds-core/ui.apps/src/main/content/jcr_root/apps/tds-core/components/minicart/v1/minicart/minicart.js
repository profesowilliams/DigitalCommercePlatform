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



    return {
        configJson: jsonObject.toString()
    };
});