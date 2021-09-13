"use strict";
use(function () {
    var jsonObject = {};
    if (properties && properties["label"]) {
        jsonObject["label"] = properties["label"];
    }

    jsonObject["endpoint"] = this.uiServiceDomain+this.myOrderStatusEndpoint;
    return {
        configJson: JSON.stringify(jsonObject)
    };
});
