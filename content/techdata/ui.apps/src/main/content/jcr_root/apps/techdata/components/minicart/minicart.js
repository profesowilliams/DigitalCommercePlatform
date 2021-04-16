"use strict";
use(function () {
    var itemsList = [];
    var jsonObject = new Packages.org.json.JSONObject();

    if (properties.get("cutOffValue") != null) {
        jsonObject.put("maxItems", properties.get("cutOffValue"));
    }
    if (properties.get("endpoint") != null) {
        jsonObject.put("endpoint", properties.get("endpoint"));
    }

    return {
        configJson: jsonObject.toString()
    };
});