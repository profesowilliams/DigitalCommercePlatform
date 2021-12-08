"use strict";

use(function() {
    var jsonObject = {};


    jsonObject["serialNo"] = properties["serialNo"];
    jsonObject["agreementNo"] = properties["agreementNo"];
    jsonObject["instanceNo"] = properties["instanceNo"];
    jsonObject["resellerPreOrderNo"] = properties["resellerPreOrderNo"];
    jsonObject["endUserPreOrderNo"] = properties["endUserPreOrderNo"];

    return {
        configJson: JSON.stringify(jsonObject)
    };
});