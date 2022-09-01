"use strict";
use(function () {
    var jsonObject = {};
    if (properties && properties["title"]) {
        jsonObject["title"] = properties["title"];
    }
    if (properties && properties["buttonLabel"]) {
        jsonObject["buttonLabel"] = properties["buttonLabel"];
    }
    if (properties && properties["buttonIcon"]) {
        jsonObject["buttonIcon"] = properties["buttonIcon"];
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});