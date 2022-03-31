"use strict";
use(['../common/utils.js'], function (utils) {

    var jsonObject = {};
    var productLinesGrid = {};
    var noteGrid = {};
    var informationTab = {};
    var listValues = [];
    var resourceResolver = resource.getResourceResolver();
    var modalConfig = {};

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

    if (this.uiServiceDomain != null) {
    	jsonObject["uiServiceEndPoint"] = this.uiServiceDomain+this.quotesPreviewEndPoint;
    	jsonObject["quickQuoteEndpoint"] = this.uiServiceDomain+this.quickQuoteEndpoint;
        jsonObject["pricingEndPoint"] = this.uiServiceDomain+this.quotesPreviewPricingEndPoint;
        jsonObject["companyInfoEndPoint"] = this.uiServiceDomain+this.accountAdressEndPoint;
        jsonObject["dealsForEndpoint"] = this.uiServiceDomain + this.serviceData.dealsForEndpoint;
        jsonObject["pricingConditionsEndpoint"] = this.uiServiceDomain + this.serviceData.orderLevelsForQuotePreviewEndpoint;
    }

    if (this.shopDomainPage !== null) {
        jsonObject["shopDomainPage"] = this.shopDomainPage;
    }

    if (properties && properties["headerLabel"]) {
        jsonObject["headerLabel"] = properties["headerLabel"];
    }

    if (properties && properties["noteLabel"]) {
        noteGrid["headerLabel"] = properties["noteLabel"];
    }

    if (properties && properties["enableNoteSection"]) {
            noteGrid["enableNoteSection"] = properties["enableNoteSection"];
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

    if (properties && properties["referenceMaxCharacterError"]) {
        informationTab["referenceMaxCharacterError"] = properties["referenceMaxCharacterError"];
    }

    if (properties && properties["searchDealsPlaceholder"]) {
        informationTab["searchDealsPlaceholder"]  = properties["searchDealsPlaceholder"];
    }

    if (properties && properties["dealsPricingNote"]) {
        informationTab["dealsPricingNote"]  = properties["dealsPricingNote"];
    }

    if (properties && properties["dealLabel"]) {
        informationTab["dealLabel"]  = properties["dealLabel"];
    }

    if (properties && properties["searchingDealsLabel"]) {
        informationTab["searchingDealsLabel"]  = properties["searchingDealsLabel"];
    }
    if (properties && properties["dealsFoundLabel"]) {
        informationTab["dealsFoundLabel"]  = properties["dealsFoundLabel"];
    }
    if (properties && properties["noDealsFoundLabel"]) {
        informationTab["noDealsFoundLabel"]  = properties["noDealsFoundLabel"];
    }
    if (properties && properties["bidLabel"]) {
        informationTab["bidLabel"]  = properties["bidLabel"];
    }
    if (properties && properties["versionLabel"]) {
        informationTab["versionLabel"]  = properties["versionLabel"];
    }
    if (properties && properties["spaIdLabel"]) {
        informationTab["spaIdLabel"]  = properties["spaIdLabel"];
    }
    if (properties && properties["endUserNameLabel"]) {
        informationTab["endUserNameLabel"]  = properties["endUserNameLabel"];
    }
    if (properties && properties["errorGettingDealsLabel"]) {
        informationTab["errorGettingDealsLabel"]  = properties["errorGettingDealsLabel"];
    }
    if (properties && properties["submitLabel"]) {
        informationTab["submitLabel"]  = properties["submitLabel"];
    }
    if (properties && properties["cancelLabel"]) {
        informationTab["cancelLabel"]  = properties["cancelLabel"];
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
    if (properties && properties["userInfoIndustlabel"]) {
        informationTab["userInfoIndustlabel"]  = properties["userInfoIndustlabel"];
    }
	if (properties && properties["userInfoNamelabel"]) {
        informationTab["userInfoNamelabel"]  = properties["userInfoNamelabel"];
    }
	if (properties && properties["userInfoAddressLabel"]) {
        informationTab["userInfoAddressLabel"]  = properties["userInfoAddressLabel"];
    }
	if (properties && properties["userInfoCitylabel"]) {
        informationTab["userInfoCitylabel"]  = properties["userInfoCitylabel"];
    }
    if (properties && properties["userInfoStatelabel"]) {
        informationTab["userInfoStatelabel"]  = properties["userInfoStatelabel"];
    }
    if (properties && properties["userInfoZiplabel"]) {
        informationTab["userInfoZiplabel"]  = properties["userInfoZiplabel"];
    }
    if (properties && properties["userInfoCountryLabel"]) {
        informationTab["userInfoCountryLabel"]  = properties["userInfoCountryLabel"];
    }
    if (properties && properties["userInfoEmailLabel"]) {
        informationTab["userInfoEmailLabel"]  = properties["userInfoEmailLabel"];
    }
    if (properties && properties["userInfoPhoneLabel"]) {
        informationTab["userInfoPhoneLabel"]  = properties["userInfoPhoneLabel"];
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

    if (properties && properties["avtValue"]) {
        modalConfig["avtValue"]  = properties["avtValue"];
    }

    if (properties && properties["techDataValue"]) {
        modalConfig["techDataValue"]  = properties["techDataValue"];
    }

    if (properties && properties["title"]) {
        modalConfig["title"]  = properties["title"];
    }

    if (properties && properties["cannotCreateQuoteForDeal"]) {
        modalConfig["cannotCreateQuoteForDeal"] = properties["cannotCreateQuoteForDeal"];
    }

    if (properties && properties["error404Message"]) {
        modalConfig["error404Message"] = properties["error404Message"];
    }

    if (properties && properties["errorGenericMessage"]) {
        modalConfig["errorGenericMessage"] = properties["errorGenericMessage"];
    }

    if (properties && properties["errorLoadingPageRedirect"]) {
        modalConfig["errorLoadingPageRedirect"] = properties["errorLoadingPageRedirect"];
    }

    if (properties && properties["errorLoadingPageTitle"]) {
        modalConfig["errorLoadingPageTitle"] = properties["errorLoadingPageTitle"];
    }
    
    if (this.productEmptyImageUrl) {
        productLinesGrid["productEmptyImageUrl"] = this.productEmptyImageUrl;
    }

    if (properties && properties["menuCopy"]) {
        productLinesGrid["menuCopy"] = properties["menuCopy"];
    }

    if (properties && properties["menuCopyWithHeaders"]) {
        productLinesGrid["menuCopyWithHeaders"] = properties["menuCopyWithHeaders"];
    }

    if (properties && properties["menuExport"]) {
        productLinesGrid["menuExport"] = properties["menuExport"];
    }

    if (properties && properties["menuCsvExport"]) {
        productLinesGrid["menuCsvExport"] = properties["menuCsvExport"];
    }

    if (properties && properties["menuExcelExport"]) {
        productLinesGrid["menuExcelExport"] = properties["menuExcelExport"];
    }

    if (properties && properties["menuOpenLink"]) {
        productLinesGrid["menuOpenLink"] = properties["menuOpenLink"];
    }

    if (properties && properties["menuCopyLink"]) {
        productLinesGrid["menuCopyLink"] = properties["menuCopyLink"];
    }

    if (this.agGridLicenseKey) {
        jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
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

    if (properties && properties["successRedirectPage"]) {
        jsonObject["successRedirectPage"]  = properties["successRedirectPage"];
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

    if (modalConfig != null) {
        jsonObject["modalConfig"] = modalConfig;
    }



    return {
        configJson: JSON.stringify(jsonObject)
    };
});