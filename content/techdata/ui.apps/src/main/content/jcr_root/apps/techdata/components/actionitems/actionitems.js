"use strict";
use(function () {
    var jsonObject = {};
    if (properties && properties["mainTitle"]) {
        jsonObject["mainTitle"] = properties["mainTitle"];
    }

    if (properties && properties["mainTitle"]) {
        jsonObject["mainTitle"] = properties["mainTitle"];
    }

    if (properties && properties["ordersBlocked"]) {
        jsonObject["ordersBlocked"] = properties["ordersBlocked"];
    }

    if (properties && properties["iconOrdersBlocked"]) {
        jsonObject["iconOrdersBlocked"] = properties["iconOrdersBlocked"];
    }

    if (properties && properties["dealsExpiring"]) {
        jsonObject["dealsExpiring"] = properties["dealsExpiring"];
    }

    if (properties && properties["iconDealsExpiring"]) {
        jsonObject["iconDealsExpiring"] = properties["iconDealsExpiring"];
    }

     if (this.uiServiceDomain != null && this.topItemsEndpoint != null) {
        jsonObject["uiServiceEndPoint"] = this.uiServiceDomain + this.topItemsEndpoint;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});