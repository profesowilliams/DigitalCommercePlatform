"use strict";
use(function () {

    var jsonObject = {};


    if (properties && properties["subheaderLabel"]) {
        jsonObject["subheaderLabel"] = properties["subheaderLabel"];
    }

    if (properties && properties["resellerContactLabel"]) {
        jsonObject["resellerContactLabel"] = properties["resellerContactLabel"];
    }
    if (properties && properties["endUserContactLabel"]) {
        jsonObject["endUserContactLabel"]= properties["endUserContactLabel"];
    }
    if (properties && properties["subtotalLabel"]) {
        jsonObject["subtotalLabel"] = properties["subtotalLabel"];
    }
     if (this.uiServiceDomain != null) {
    jsonObject["uiServiceEndPoint"] = this.uiServiceDomain+this.quoteDetailEndpoint;
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});