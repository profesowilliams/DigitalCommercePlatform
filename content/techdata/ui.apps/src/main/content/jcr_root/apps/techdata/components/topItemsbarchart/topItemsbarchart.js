"use strict";
use(function () {
    var jsonObject = {};
    if (properties && properties["label"]) {
        jsonObject["label"] = properties["label"];
    }
    if (properties && properties["uiServiceEndPoint"]) {
        jsonObject["uiServiceEndPoint"] = properties["uiServiceEndPoint"];
    }
    if (properties && properties["sort"]) {
        jsonObject["sort"] = properties["sort"];
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});