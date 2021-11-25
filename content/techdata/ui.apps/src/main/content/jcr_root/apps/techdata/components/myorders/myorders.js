"use strict";
use(function () {
    var jsonObject = {};
    if (properties && properties["label"]) {
        jsonObject["label"] = properties["label"];
    }

    if (properties && properties["days30Label"]) {
        jsonObject["days30Label"] = properties["days30Label"];
    }

    if (properties && properties["days90Label"]) {
        jsonObject["days90Label"] = properties["days90Label"];
    }

    jsonObject["endpoint"] = this.uiServiceDomain+this.myOrdersEndpoint;
    return {
        configJson: JSON.stringify(jsonObject)
    };
});
