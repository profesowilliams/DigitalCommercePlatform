"use strict";
use(['../common/utils.js'], function(utils) {
    var jsonObject = {};

    var productLines = {};

    if (properties && properties["line"]) {
        productLines["line"] = properties["line"];
    }

    if (properties && properties["productfamily"]) {
        productLines["productfamily"] = properties["productfamily"];
    }
    if (properties && properties["productdescription"]) {
        productLines["productdescription"] = properties["productdescription"];
    }
    if (properties && properties["vendorPartNo"]) {
        productLines["vendorPartNo"] = properties["vendorPartNo"];
    }
    if (properties && properties["unitPrice"]) {
        productLines["unitPrice"] = properties["unitPrice"];
    }
    if (properties && properties["quantity"]) {
        productLines["quantity"] = properties["quantity"];
    }
    if (properties && properties["quoteSubtotal"]) {
        productLines["quoteSubtotal"] = properties["quoteSubtotal"];
    }
    if (properties && properties["note"]) {
        productLines["note"] = properties["note"];
    }

    if(productLines != null){
        jsonObject["productLines"] = productLines;
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});