"use strict";
use(function () {
    var jsonObject = new Packages.org.json.JSONObject();
    if (properties.get("label") != null) {
        jsonObject.put("label", properties.get("label"));
    }
    if (properties.get("uiServiceEndPoint") != null) {
        jsonObject.put("uiServiceEndPoint", properties.get("uiServiceEndPoint"));
    }
    return {
        configJson: jsonObject.toString()
    };
});