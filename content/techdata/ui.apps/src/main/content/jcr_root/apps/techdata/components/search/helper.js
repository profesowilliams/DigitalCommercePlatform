"use strict";

use(function() {
    console.log("112233");
    var jsonObject = {};
    var keyValues = [];

var listOfElementsData = properties["listOfElements"];

    for (var key in listOfElementsData) {
        var labelEndpointData = {};

  console.log(listOfElementsData[key]);
        if(listOfElementsData[key].toString() == "all") {
            labelEndpointData.label ="All";
            labelEndpointData.endpoint =this.allSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "products") {
            labelEndpointData.label ="Products";
            labelEndpointData.endpoint = this.productSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "content") {
            labelEndpointData.label ="Content";
            labelEndpointData.endpoint = this.contentSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "quotes") {
            labelEndpointData.label ="Quotes";
            labelEndpointData.endpoint = this.quoteSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "orders") {
            labelEndpointData.label ="Orders";
            labelEndpointData.endpoint = this.orderSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "spas") {
            labelEndpointData.label ="SPA's";
            labelEndpointData.endpoint = this.spaSearchEndpoint;
            keyValues.push(labelEndpointData);

        }
}
jsonObject["dropdownList"] = keyValues;
console.log(JSON.stringify(jsonObject));
    return {
        configJson: JSON.stringify(jsonObject)
    };
});