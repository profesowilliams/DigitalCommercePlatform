"use strict";
use(function () {
    var jsonObject = {};
    if (properties && properties["label"]) {
        jsonObject["label"] = properties["label"];
    }
    if (properties && properties["paramOneLabel"]) {
        jsonObject["paramOneLabel"] = properties["paramOneLabel"];
    }
    if (properties && properties["paramTwoLabel"]) {
        jsonObject["paramTwoLabel"] = properties["paramTwoLabel"];
    }
    if (properties && properties["paramThreeLabel"]) {
        jsonObject["paramThreeLabel"] = properties["paramThreeLabel"];
    }
    if (properties && properties["todayLabel"]) {
        jsonObject["todayLabel"] = properties["todayLabel"];
    }
    if (properties && properties["uiServiceEndPoint"]) {
        jsonObject["uiServiceEndPoint"] = properties["uiServiceEndPoint"];
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});
