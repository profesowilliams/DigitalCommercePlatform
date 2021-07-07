"use strict";

use(function() {
    var jsonObject = {};
    var keyValues = [];

var listOfElementsData = properties["listOfElements"];

var singleLabelEndpointData = {};

    if(listOfElementsData == "all") {
            singleLabelEndpointData.label = "All";
            singleLabelEndpointData.endpoint = this.allSearchEndpoint;
            keyValues.push(singleLabelEndpointData);

        } else if(listOfElementsData == "products") {
            singleLabelEndpointData.label = "Products";
            singleLabelEndpointData.endpoint = this.productSearchEndpoint;
            keyValues.push(singleLabelEndpointData);

        } else if(listOfElementsData == "content") {
            singleLabelEndpointData.label = "Content";
            singleLabelEndpointData.endpoint = this.contentSearchEndpoint;
            keyValues.push(singleLabelEndpointData);

        } else if(listOfElementsData == "quotes") {
            singleLabelEndpointData.label = "Quotes";
            singleLabelEndpointData.endpoint = this.quoteSearchEndpoint;
            keyValues.push(singleLabelEndpointData);

        } else if(listOfElementsData == "orders") {
            singleLabelEndpointData.label = "Orders";
            singleLabelEndpointData.endpoint = this.orderSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData == "spas") {
            labelEndpointData.label = "Spa's";
            labelEndpointData.endpoint = this.spaSearchEndpoint;
            keyValues.push(singleLabelEndpointData);

        }

    for (var key in listOfElementsData) {
        var labelEndpointData = {};

  console.log(listOfElementsData[key]);
        if(listOfElementsData[key].toString() == "all") {
            labelEndpointData.label = "All";
            labelEndpointData.endpoint =this.allSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "products") {
            labelEndpointData.label = "Products";
            labelEndpointData.endpoint = this.productSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "content") {
            labelEndpointData.label = "Content";
            labelEndpointData.endpoint = this.contentSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "quotes") {
            labelEndpointData.label = "Quotes";
            labelEndpointData.endpoint = this.quoteSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "orders") {
            labelEndpointData.label = "Orders";
            labelEndpointData.endpoint = this.orderSearchEndpoint;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "spas") {
            labelEndpointData.label = "SPA's";
            labelEndpointData.endpoint = this.spaSearchEndpoint;
            keyValues.push(labelEndpointData);

        }
}
jsonObject["dropdownList"] = keyValues;
    return {
        configJson: JSON.stringify(jsonObject)
    };
});