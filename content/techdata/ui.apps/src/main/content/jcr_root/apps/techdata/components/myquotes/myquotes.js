"use strict";
use(function () {
    var jsonObject = {};
    if (properties && properties["label"]) {
        jsonObject["label"] = properties["label"];
    }
    if (properties && properties["labelConverted"]) {
            jsonObject["labelConverted"] = properties["labelConverted"];
        }
    if (properties && properties["labelOpen"]) {
              jsonObject["labelOpen"] = properties["labelOpen"];
          }
    if (properties && properties["labelQuoteToOrder"]) {
                  jsonObject["labelQuoteToOrder"] = properties["labelQuoteToOrder"];
              }
    if (properties && properties["labelActiveQuoteValue"]) {
                  jsonObject["labelActiveQuoteValue"] = properties["labelActiveQuoteValue"];
              }
     if (this.uiServiceDomain != null) {
    jsonObject["uiServiceEndPoint"] = this.uiServiceDomain+this.myQuotesEndpoint;
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});
