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
            singleLabelEndpointData.endpoint = this.searchDomain+this.legacySearchEndpoint+this.searchKeywordParameter;
            keyValues.push(singleLabelEndpointData);

        } else if(listOfElementsData == "quotes") {
            singleLabelEndpointData.label = "Quotes";
            singleLabelEndpointData.endpoint = this.uiServiceDomain+this.quoteSearchEndpoint;
            singleLabelEndpointData.quoteListingPage = this.quoteListingPage;
            singleLabelEndpointData.quoteDetailPage = this.quoteDetailPage;
            singleLabelEndpointData.quotePreviewPage = this.quotePreviewPage;
            keyValues.push(singleLabelEndpointData);

        } else if(listOfElementsData == "orders") {
            singleLabelEndpointData.label = "Orders";
            singleLabelEndpointData.endpoint = this.uiServiceDomain+this.orderSearchEndpoint;
            singleLabelEndpointData.orderListingPage = this.orderListingPage;
            singleLabelEndpointData.orderDetailPage = this.orderDetailPage;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData == "spas") {
            singleLabelEndpointData.label = "Spa's";
            singleLabelEndpointData.endpoint = this.uiServiceDomain+this.spaSearchEndpoint;
            keyValues.push(singleLabelEndpointData);

        }

    for (var key in listOfElementsData) {
        var labelEndpointData = {};


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
            labelEndpointData.endpoint = this.searchDomain+this.legacySearchEndpoint+this.searchKeywordParameter;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "quotes") {
            labelEndpointData.label = "Quotes";
            labelEndpointData.endpoint = this.uiServiceDomain+this.quoteSearchEndpoint;
            labelEndpointData.quoteListingPage = this.quoteListingPage;
            labelEndpointData.quoteDetailPage = this.quoteDetailPage;
            labelEndpointData.quotePreviewPage = this.quotePreviewPage;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "orders") {
            labelEndpointData.label = "Orders";
            labelEndpointData.endpoint = this.uiServiceDomain+this.orderSearchEndpoint;
			labelEndpointData.orderListingPage = this.orderListingPage;
            labelEndpointData.orderDetailPage = this.orderDetailPage;
            keyValues.push(labelEndpointData);

        } else if(listOfElementsData[key].toString() == "spas") {
            labelEndpointData.label = "SPA's";
            labelEndpointData.endpoint = this.uiServiceDomain+this.spaSearchEndpoint;
            keyValues.push(labelEndpointData);

        }
}

jsonObject["dropdownList"] = keyValues;

    if(this.dcpDashboardPage != null){
    	jsonObject["dcpDashboardPage"] = this.dcpDashboardPage;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});
