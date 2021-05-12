"use strict";
use(function () {
    var itemsList = [];
    var jsonObject = new Packages.org.json.JSONObject();

    if (properties.get("label") != null) {
        jsonObject.put("label", properties.get("label"));
    }
    if (properties.get("endpoint") != null) {
        jsonObject.put("endpoint", properties.get("endpoint"));
    }

    return {
        configJson: jsonObject.toString()
    };
});