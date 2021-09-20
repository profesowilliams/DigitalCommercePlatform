"use strict";
use(['../common/utils.js'], function (utils) {

    var jsonObject = {};
    var productLinesGrid = {};
    var noteGrid = {};
    var informationTab = {};
    var listValues = [];
    var resourceResolver = resource.getResourceResolver();

    var node = resourceResolver.getResource(currentNode.getPath() + "/columnList");

    if (node !== null) {
        var childrenList = node.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var columnLabel = res.properties["columnLabel"];
            var columnKey = res.properties["columnKey"];
            var sortable = res.properties["sortable"];
            var itemData = {};
            itemData.columnLabel = columnLabel;
            itemData.columnKey = columnKey;
            itemData.sortable = sortable;
            listValues.push(itemData);

        }
    }

    var tierOptionsValues = utils.getDataFromMultifield(resourceResolver, "tierOptions", function(childResource) {
        var itemData = {};
    
        itemData.label = childResource.properties["tierOptionLabel"];
        itemData.value = childResource.properties["tierOptionValue"];
    
        return itemData;
    });

    if (tierOptionsValues != null) {
        informationTab["tierOptions"] = tierOptionsValues;
    }

    if (this.uiServiceDomain != null) {
    	jsonObject["uiServiceEndPoint"] = this.uiServiceDomain+this.quotesPreviewEndPoint;
    }
    if (this.uiServiceDomain != null) {
    	jsonObject["pricingEndPoint"] = this.uiServiceDomain+this.quotesPreviewPricingEndPoint;
    }
    if (this.uiServiceDomain != null) {
    	jsonObject["companyInfoEndPoint"] = this.uiServiceDomain+this.accountAdressEndPoint;
    }

    if (properties && properties["headerLabel"]) {
        jsonObject["headerLabel"] = properties["headerLabel"];
    }

    if (properties && properties["noteLabel"]) {
        noteGrid["headerLabel"] = properties["noteLabel"];
    }

    if (properties && properties["setupRequiredLabel"]) {
        noteGrid["setupRequiredLabel"] = properties["setupRequiredLabel"];
    }

    if (properties && properties["attachmentRequiredLabel"]) {
        noteGrid["attachmentRequiredLabel"]  = properties["attachmentRequiredLabel"];
    }

    if (properties && properties["yourCompanyHeaderLabel"]) {
        informationTab["yourCompanyHeaderLabel"]  = properties["yourCompanyHeaderLabel"];
    }

    if (properties && properties["endUserHeaderLabel"]) {
        informationTab["endUserHeaderLabel"]  = properties["endUserHeaderLabel"];
    }

    if (properties && properties["generalHeaderLabel"]) {
        informationTab["generalHeaderLabel"]  = properties["generalHeaderLabel"];
    }

    if (properties && properties["emailLabel"]) {
        informationTab["emailLabel"]  = properties["emailLabel"];
    }

    if (properties && properties["phoneLabel"]) {
        informationTab["phoneLabel"]  = properties["phoneLabel"];
    }

    if (properties && properties["sourceLabel"]) {
        informationTab["sourceLabel"]  = properties["sourceLabel"];
    }

    if (properties && properties["tierLabel"]) {
        informationTab["tierLabel"]  = properties["tierLabel"];
    }

    if (properties && properties["referenceLabel"]) {
        informationTab["referenceLabel"]  = properties["referenceLabel"];
    }

    if (properties && properties["dealLabel"]) {
        informationTab["dealLabel"]  = properties["dealLabel"];
    }
     if (properties && properties["dealLabel"]) {
        informationTab["dealLabel"]  = properties["dealLabel"];
    }
     if (properties && properties["companyLabel"]) {
        informationTab["companyLabel"]  = properties["companyLabel"];
    }
     if (properties && properties["nameLabel"]) {
        informationTab["nameLabel"]  = properties["nameLabel"];
    }
     if (properties && properties["addressLabel"]) {
        informationTab["addressLabel"]  = properties["addressLabel"];
    }
     if (properties && properties["cityLabel"]) {
        informationTab["cityLabel"]  = properties["cityLabel"];
    }
     if (properties && properties["stateLabel"]) {
        informationTab["stateLabel"]  = properties["stateLabel"];
    }
     if (properties && properties["zipLabel"]) {
        informationTab["zipLabel"]  = properties["zipLabel"];
    }
    if (properties && properties["countryLabel"]) {
        informationTab["countryLabel"]  = properties["countryLabel"];
    }
    if (properties && properties["label"]) {
        productLinesGrid["label"]  = properties["label"];
    }

    if (properties && properties["expandAllLabel"]) {
        productLinesGrid["expandAllLabel"]  = properties["expandAllLabel"];
    }


    if (properties && properties["collapseAllLabel"]) {
        productLinesGrid["collapseAllLabel"]  = properties["collapseAllLabel"];
    }


    if (properties && properties["startDateLabel"]) {
        productLinesGrid["startDateLabel"]  = properties["startDateLabel"];
    }

    if (properties && properties["autoRenewLabel"]) {
        productLinesGrid["autoRenewLabel"]  = properties["autoRenewLabel"];
    }

    if (properties && properties["durationLabel"]) {
        productLinesGrid["durationLabel"]  = properties["durationLabel"];
    }

    if (properties && properties["billingLabel"]) {
        productLinesGrid["billingLabel"]  = properties["billingLabel"];
    }

    if (properties && properties["yesLabel"]) {
        productLinesGrid["yesLabel"]  = properties["yesLabel"];
    }

    if (properties && properties["noLabel"]) {
        productLinesGrid["noLabel"]  = properties["noLabel"];
    }


    if (properties && properties["subtotalLabel"]) {
        jsonObject["subtotalLabel"]  = properties["subtotalLabel"];
    }

    if (properties && properties["confirmButtonLabel"]) {
        jsonObject["confirmButtonLabel"]  = properties["confirmButtonLabel"];
    }


    if (properties && properties["defaultChoiceLabel"]) {
        jsonObject["defaultChoiceLabel"]  = properties["defaultChoiceLabel"];
    }

    if (properties && properties["continueWithStandardPriceLabel"]) {
        jsonObject["continueWithStandardPriceLabel"]  = properties["continueWithStandardPriceLabel"];
    }

    if (listValues != null) {
        productLinesGrid["columnList"] = listValues;
    }
    if (informationTab != null) {
        jsonObject["information"] = informationTab;
    }
    if (productLinesGrid != null) {
        jsonObject["productLines"] = productLinesGrid;
    }
    if (noteGrid != null) {
        jsonObject["note"] = noteGrid;
    }



    return {
        configJson: JSON.stringify(jsonObject)
    };
});