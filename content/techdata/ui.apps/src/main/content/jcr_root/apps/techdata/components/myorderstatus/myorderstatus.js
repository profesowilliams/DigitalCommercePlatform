"use strict";
use(function () {
    var jsonObject = {};
    if (properties) {
        if(properties["label"]) {
            jsonObject["label"] = properties["label"];
        }
        if(properties["fromDateInYears"]) {
            jsonObject["fromDateInYears"] = properties["fromDateInYears"];
        }
    }

    jsonObject["endpoint"] = this.uiServiceDomain+this.myOrderStatusEndpoint;
    return {
        configJson: JSON.stringify(jsonObject)
    };
});
