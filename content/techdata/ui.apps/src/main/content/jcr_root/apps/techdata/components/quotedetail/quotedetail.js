"use strict";
use(function () {

    var jsonObject = {};


    if (properties && properties["fileReference"]) {
        jsonObject["logoURL"] = properties["fileReference"];
    }

    if (properties && properties["downloadLinkText"]) {
        jsonObject["downloadLinkText"] = properties["downloadLinkText"];
    }

    if (properties && properties["fileName"]) {
        jsonObject["fileName"] = properties["fileName"];
    }

    if (properties && properties["subheaderLabel"]) {
        jsonObject["subheaderLabel"] = properties["subheaderLabel"];
    }

    if (properties && properties["createdDateLabel"]) {
        jsonObject["createdDateLabel"] = properties["createdDateLabel"];
    }

    if (properties && properties["expiresDateLabel"]) {
        jsonObject["expiresDateLabel"] = properties["expiresDateLabel"];
    }

    if (properties && properties["subTotalLabel"]) {
        jsonObject["subTotalLabel"] = properties["subTotalLabel"];
    }

    if (properties && properties["confirmButtonLabel"]) {
        jsonObject["confirmButtonLabel"] = properties["confirmButtonLabel"];
    }

    if (properties && properties["makeChoiceLabel"]) {
        jsonObject["makeChoiceLabel"] = properties["makeChoiceLabel"];
    }

    if (properties && properties["continueStandardPriceLabel"]) {
        jsonObject["continueStandardPriceLabel"] = properties["continueStandardPriceLabel"];
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

    if (this.uiServiceDomain !== null) {
    jsonObject["uiServiceEndPoint"] = this.uiServiceDomain+this.quoteDetailEndpoint;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});