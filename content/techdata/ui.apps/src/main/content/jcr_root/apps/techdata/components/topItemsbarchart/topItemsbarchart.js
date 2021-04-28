"use strict";
use(function () {
    var jsonObject = {};
    if (properties && properties["label"]) {
        jsonObject["label"]= properties["label"];
    }
    if (properties && properties["uiServiceEndPoint"]) {
        jsonObject["uiServiceEndPoint"]=properties["uiServiceEndPoint"];
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});