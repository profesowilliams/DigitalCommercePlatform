"use strict";
use(['../common/utils.js'], function (utils) {

    var jsonObject = {};
    var informationTab = {};
    var productLinesTab = {};
    var listValues = [];
    var quoteOptionsTab = {};
    var whiteLabelTab = {};
    var whiteInformation = {};
    var whiteCheckboxItems = {};
    var whiteListValues = [];

    var resourceResolver = resource.getResourceResolver();

    var node = resourceResolver.getResource(currentNode.getPath() + "/columnList");

    var whiteColumNode = resourceResolver.getResource(currentNode.getPath() + "/whiteLabelColumnList");


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

    if (properties && properties["subheaderTitle"]) {
        jsonObject["subheaderTitle"] = properties["subheaderTitle"];
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
        jsonObject["endUserContactLabel"] = properties["endUserContactLabel"];
    }

    if (properties && properties["subtotalLabel"]) {
        jsonObject["subtotalLabel"] = properties["subtotalLabel"];
    }

    if (this.agGridLicenseKey) {
        jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
    }

    if (this.uiServiceDomain !== null) {
        jsonObject["uiServiceEndPoint"] = this.uiServiceDomain + this.quoteDetailEndpoint;
    }

    if (this.uiServiceDomain !== null) {
        jsonObject["uiServiceEndPointExcel"] = this.uiServiceDomain + this.quoteDetailsXLSEndpoint;
    }
    
    if (this.shopDomainPage !== null) {
        jsonObject["shopDomainPage"] = this.shopDomainPage;
    }

    if (properties && properties["yourCompanyHeaderLabel"]) {
        informationTab["yourCompanyHeaderLabel"] = properties["yourCompanyHeaderLabel"];
    }

    if (properties && properties["yourLogoLabel"]) {
        informationTab["yourLogoLabel"] = properties["yourLogoLabel"];
    }

    if (properties && properties["productImagesLabel"]) {
        informationTab["productImagesLabel"] = properties["productImagesLabel"];
    }


    if (properties && properties["partNoManufacturerLabel"]) {
        informationTab["partNoManufacturerLabel"] = properties["partNoManufacturerLabel"];
    }

    if (properties && properties["partNoTDLabel"]) {
        informationTab["partNoTDLabel"] = properties["partNoTDLabel"];
    }

    if (properties && properties["trackingNoLabel"]) {
        informationTab["trackingNoLabel"] = properties["trackingNoLabel"];
    }

    if (properties && properties["MSRPLabel"]) {
        informationTab["MSRPLabel"] = properties["MSRPLabel"];
    }

    if (properties && properties["endUserHeaderLabel"]) {
        informationTab["endUserHeaderLabel"] = properties["endUserHeaderLabel"];
    }

    if (properties && properties["generalHeaderLabel"]) {
        informationTab["generalHeaderLabel"] = properties["generalHeaderLabel"];
    }

    if (properties && properties["emailLabel"]) {
        informationTab["emailLabel"] = properties["emailLabel"];
    }

    if (properties && properties["phoneLabel"]) {
        informationTab["phoneLabel"] = properties["phoneLabel"];
    }

    if (properties && properties["sourceLabel"]) {
        informationTab["sourceLabel"] = properties["sourceLabel"];
    }

    if (properties && properties["tierLabel"]) {
        informationTab["tierLabel"] = properties["tierLabel"];
    }

    if (properties && properties["referenceLabel"]) {
        informationTab["referenceLabel"] = properties["referenceLabel"];
    }

    if (properties && properties["dealLabel"]) {
        informationTab["dealLabel"] = properties["dealLabel"];
    }

    if (informationTab != null) {
        jsonObject["information"] = informationTab;
    }

    if (properties && properties["label"]) {
        productLinesTab["label"] = properties["label"];
    }

    if (properties && properties["applyMarkupLabel"]) {
        productLinesTab["applyMarkupLabel"] = properties["applyMarkupLabel"];
    }
    if (properties && properties["expandAllLabel"]) {
        productLinesTab["expandAllLabel"] = properties["expandAllLabel"];
    }

    if (properties && properties["collapseAllLabel"]) {
        productLinesTab["collapseAllLabel"] = properties["collapseAllLabel"];
    }

    if (properties && properties["startDateLabel"]) {
        productLinesTab["startDateLabel"] = properties["startDateLabel"];
    }

    if (properties && properties["autoRenewLabel"]) {
        productLinesTab["autoRenewLabel"] = properties["autoRenewLabel"];
    }

    if (properties && properties["durationLabel"]) {
        productLinesTab["durationLabel"] = properties["durationLabel"];
    }

    if (properties && properties["billingLabel"]) {
        productLinesTab["billingLabel"] = properties["billingLabel"];
    }

    if (properties && properties["yesLabel"]) {
        productLinesTab["yesLabel"] = properties["yesLabel"];
    }

    if (properties && properties["noLabel"]) {
        productLinesTab["noLabel"] = properties["noLabel"];
    }

    if (this.productEmptyImageUrl) {
        productLinesTab["productEmptyImageUrl"] = this.productEmptyImageUrl;
    }

    if (node !== null) {
        var childrenList = node.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var columnLabel = res.properties["columnLabel"];
            var columnKey = res.properties["columnKey"];
            var itemData = {};
            itemData.columnLabel = columnLabel;
            itemData.columnKey = columnKey;
            listValues.push(itemData);
        }
    }

    if (listValues != null) {
        productLinesTab["columnList"] = listValues;
    }

    if (productLinesTab != null) {
        jsonObject["productLines"] = productLinesTab;
    }

    jsonObject["checkout"] = utils.getCheckoutConfigurations(this.serviceData);

    if (properties && properties["dropdownLabel"]) {
        quoteOptionsTab["dropdownLabel"] = properties["dropdownLabel"];
    }

    if (properties && properties["exportToCSV"]) {
        quoteOptionsTab["exportToCSV"] = properties["exportToCSV"];
    }

    if (properties && properties["exportToPDF"]) {
        quoteOptionsTab["exportToPDF"] = properties["exportToPDF"];
    }

    if (properties && properties["whiteLabelQuote"]) {
        quoteOptionsTab["whiteLabelQuote"] = properties["whiteLabelQuote"];
    }

    if (properties && properties["checkoutLabel"]) {
        quoteOptionsTab["checkoutLabel"] = properties["checkoutLabel"];
    }

    if (quoteOptionsTab != null) {
        jsonObject["quoteOptions"] = quoteOptionsTab;
    }

    if (properties && properties["markubLabel"]) {
        whiteLabelTab["markubLabel"] = properties["markubLabel"];
    }

    if (properties && properties["whiteMSRPLabel"]) {
        whiteLabelTab["MSRPLabel"] = properties["whiteMSRPLabel"];
    }

    if (properties && properties["description"]) {
        whiteLabelTab["description"] = properties["description"];
    }

    if (properties && properties["value"]) {
        whiteLabelTab["value"] = properties["value"];
    }

    if (properties && properties["addNew"]) {
        whiteLabelTab["addNew"] = properties["addNew"];
    }

    if (properties && properties["yourCostLabel"]) {
        whiteLabelTab["yourCostLabel"] = properties["yourCostLabel"];
    }

    if (properties && properties["yourCustomerPriceLabel"]) {
        whiteLabelTab["yourCustomerPriceLabel"] = properties["yourCustomerPriceLabel"];
    }

    if (properties && properties["yourMarkupLabel"]) {
        whiteLabelTab["yourMarkupLabel"] = properties["yourMarkupLabel"];
    }

    if (properties && properties["subtotalWhiteLabel"]) {
        whiteLabelTab["subtotalLabel"] = properties["subtotalWhiteLabel"];
    }

    if (properties && properties["ancillaryItemsLabel"]) {
        whiteLabelTab["ancillaryItemsLabel"] = properties["ancillaryItemsLabel"];
    }

    if (properties && properties["endUserTotalLabel"]) {
        whiteLabelTab["endUserTotalLabel"] = properties["endUserTotalLabel"];
    }

    if (properties && properties["savingsLabel"]) {
        whiteLabelTab["savingsLabel"] = properties["savingsLabel"];
    }

    if (properties && properties["applyToAllLabel"]) {
        whiteLabelTab["applyToAllLabel"] = properties["applyToAllLabel"];
    }

    if (properties && properties["applyMarkupWhiteLabel"]) {
        whiteLabelTab["applyMarkupLabel"] = properties["applyMarkupWhiteLabel"];
    }

    if (properties && properties["previewQuoteLabel"]) {
        whiteLabelTab["previewQuoteLabel"] = properties["previewQuoteLabel"];
    }

    if (properties && properties["yourWhiteLogoLabel"]) {
        whiteInformation["yourWhiteLogoLabel"] = properties["yourWhiteLogoLabel"];
    }

    if (whiteInformation != null) {
        whiteLabelTab["information"] = whiteInformation;
    }
    if (properties && properties["titleLabel"]) {
        whiteLabelTab["titleLabel"] = properties["titleLabel"];
    }

    if (properties && properties["subtitleLabel"]) {
        whiteLabelTab["subtitleLabel"] = properties["subtitleLabel"];
    }

    if (properties && properties["logoLabel"]) {
        whiteCheckboxItems["logoLabel"] = properties["logoLabel"];
    }

    if (properties && properties["imageLabel"]) {
        whiteCheckboxItems["imageLabel"] = properties["imageLabel"];
    }

    if (properties && properties["manufacturerLabel"]) {
        whiteCheckboxItems["manufacturerLabel"] = properties["manufacturerLabel"];
    }

    if (properties && properties["partNumberTDLabel"]) {
        whiteCheckboxItems["partNumberTDLabel"] = properties["partNumberTDLabel"];
    }

    if (properties && properties["whiteCheckboxmsrpLabel"]) {
        whiteCheckboxItems["msrpLabel"] = properties["whiteCheckboxmsrpLabel"];
    }

    if (whiteCheckboxItems != null) {
        whiteLabelTab["checkboxItems"] = whiteCheckboxItems;
    }

    if (whiteColumNode !== null) {
        var childrenList = whiteColumNode.getChildren();

        for (var [key, res] in Iterator(childrenList)) {
            var columnLabel = res.properties["columnLabel"];
            var columnKey = res.properties["columnKey"];
            var itemData = {};
            itemData.columnLabel = columnLabel;
            itemData.columnKey = columnKey;
            whiteListValues.push(itemData);
        }
    }

    if (whiteListValues != null) {
        whiteLabelTab["columnList"] = whiteListValues;
    }

    if (whiteLabelTab != null) {
        jsonObject["whiteLabel"] = whiteLabelTab;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});