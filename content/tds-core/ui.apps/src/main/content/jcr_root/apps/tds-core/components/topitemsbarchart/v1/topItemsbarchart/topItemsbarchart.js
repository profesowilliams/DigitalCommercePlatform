"use strict";
use(function () {
    var jsonObject = {};
    if (properties && properties["label"]) {
        jsonObject["label"] = properties["label"];
    }
     if (this.uiServiceDomain != null) {
        jsonObject["uiServiceEndPoint"] = this.uiServiceDomain+this.topItemsEndpoint+properties["method"];
    }
    if (properties && properties["sort"]) {
        jsonObject["sort"] = properties["sort"];
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});