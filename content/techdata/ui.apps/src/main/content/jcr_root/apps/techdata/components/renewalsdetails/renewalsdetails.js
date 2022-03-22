"use strict";
use(['../common/utils.js'], function(utils) {
    var jsonObject = {};

    var productLines = {};
    var quotePreview = {};
    var reseller = {};
    var agreementInfo = {};
    var endCustomer = {};
    if (properties && properties["line"]) {
        productLines["line"] = properties["line"];
    }

    if (properties && properties["lineItemDetailsLabel"]) {
        productLines["lineItemDetailsLabel"] = properties["lineItemDetailsLabel"];
    }

    if (properties && properties["downloadPDFLabel"]) {
        productLines["downloadPDFLabel"] = properties["downloadPDFLabel"];
    }

    if (properties && properties["downloadXLSLabel"]) {
        productLines["downloadXLSLabel"] = properties["downloadXLSLabel"];
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

    if (properties && properties["menuCopy"]) {
        productLines["menuCopy"] = properties["menuCopy"];
    }

    if (properties && properties["menuCopyWithHeaders"]) {
        productLines["menuCopyWithHeaders"] = properties["menuCopyWithHeaders"];
    }

    if (properties && properties["menuExport"]) {
        productLines["menuExport"] = properties["menuExport"];
    }

    if (properties && properties["menuCsvExport"]) {
        productLines["menuCsvExport"] = properties["menuCsvExport"];
    }

    if (properties && properties["menuExcelExport"]) {
        productLines["menuExcelExport"] = properties["menuExcelExport"];
    }

    if (properties && properties["menuOpenLink"]) {
        productLines["menuOpenLink"] = properties["menuOpenLink"];
    }

    if (properties && properties["menuCopyLink"]) {
        productLines["menuCopyLink"] = properties["menuCopyLink"];
    }

    if (this.agGridLicenseKey) {
        jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
    }

    if (this.shopDomainPage !== null) {
        jsonObject["shopDomainPage"] = this.shopDomainPage;
    }

    if (this.serviceData.renewalDetailLineItemEndpoint) {
        jsonObject["uiServiceEndPoint"] = this.serviceData.uiServiceDomain + this.serviceData.renewalDetailLineItemEndpoint || '';
    }

    if (properties && properties["quotePreviewlabel"]) {
        quotePreview["quotePreviewlabel"] = properties["quotePreviewlabel"];
    }

    if (properties && properties["resellerLabel"]) {
        reseller["resellerLabel"] = properties["resellerLabel"];
    }

    if (properties && properties["accountNoLabel"]) {
        reseller["accountNoLabel"] = properties["accountNoLabel"];
    }
    if (properties && properties["resellerVendorAccountNoLabel"]) {
        quotePreview["resellerVendorAccountNoLabel"] = properties["resellerVendorAccountNoLabel"];
    }

    if (properties && properties["previousPurchaseOrderNoLabel"]) {
        reseller["previousPurchaseOrderNoLabel"] = properties["previousPurchaseOrderNoLabel"];
    }

    if (properties && properties["resellerSAPaccNoLabel"]) {
        reseller["resellerSAPaccNoLabel"] = properties["resellerSAPaccNoLabel"];
    }


    if (properties && properties["previousResellerorderNoLabel"]) {
        reseller["previousResellerorderNoLabel"] = properties["previousResellerorderNoLabel"];
    }


    if (properties && properties["typeEndUserLabel"]) {
        reseller["typeEndUserLabel"] = properties["typeEndUserLabel"];
    }
    if (properties && properties["vendorAccountNoResLabel"]) {
        reseller["vendorAccountNoResLabel"] = properties["vendorAccountNoResLabel"];
    }
    if (properties && properties["previousPurchaseOrderNoEndLabel"]) {
        reseller["previousPurchaseOrderNoEndLabel"] = properties["previousPurchaseOrderNoEndLabel"];
    }
    if (properties && properties["previousOrderNoLabel"]) {
        reseller["previousOrderNoLabel"] = properties["previousOrderNoLabel"];
    }

    if (reseller != null) {
        quotePreview["reseller"] = reseller;
    }


    if (properties && properties["endCustomerLabel"]) {
        endCustomer["endCustomerLabel"] = properties["endCustomerLabel"];
    }

    if (properties && properties["emailLabel"]) {
        endCustomer["emailLabel"] = properties["emailLabel"];
    }

    if (properties && properties["phoneLabel"]) {
        endCustomer["phoneLabel"] = properties["phoneLabel"];
    }
    if (properties && properties["endCustomerType"]) {
        endCustomer["endCustomerType"] = properties["endCustomerType"];
    }
    if (properties && properties["vendorAccountNo"]) {
        endCustomer["vendorAccountNo"] = properties["vendorAccountNo"];
    }
    if (properties && properties["endCustpreviousPurchaseOrderNo"]) {
        endCustomer["endCustpreviousPurchaseOrderNo"] = properties["endCustpreviousPurchaseOrderNo"];
    }
    if (endCustomer != null) {
        quotePreview["productLines"] = endCustomer;
    }

    if (properties && properties["agreementInfoLabel"]) {
        agreementInfo["agreementInfoLabel"] = properties["agreementInfoLabel"];
    }

    if (properties && properties["programLabel"]) {
        agreementInfo["programLabel"] = properties["programLabel"];
    }

    if (properties && properties["durationLabel"]) {
        agreementInfo["durationLabel"] = properties["durationLabel"];
    }
    if (properties && properties["supportLevelLabel"]) {
        agreementInfo["supportLevelLabel"] = properties["supportLevelLabel"];
    }
    if (properties && properties["distiQuoteNoLabel"]) {
        agreementInfo["distiQuoteNoLabel"] = properties["distiQuoteNoLabel"];
    }
    if (properties && properties["distiQuoteIDLabel"]) {
        agreementInfo["distiQuoteIDLabel"] = properties["distiQuoteIDLabel"];
    }
    if (properties && properties["agreementNoLabel"]) {
        agreementInfo["agreementNoLabel"] = properties["agreementNoLabel"];
    }
    if (properties && properties["distiQuoteLabel"]) {
        agreementInfo["distiQuoteLabel"] = properties["distiQuoteLabel"];
    }
    if (properties && properties["quotedueDateLabel"]) {
        agreementInfo["quotedueDateLabel"] = properties["quotedueDateLabel"];
    }
    if (properties && properties["quoteExpiryDateLabel"]) {
        agreementInfo["quoteExpiryDateLabel"] = properties["quoteExpiryDateLabel"];
    }
    if (properties && properties["agreeStartDateLabel"]) {
        agreementInfo["agreeStartDateLabel"] = properties["agreeStartDateLabel"];
    }
    if (properties && properties["agreeEndDateLabel"]) {
        agreementInfo["agreeEndDateLabel"] = properties["agreeEndDateLabel"];
    }
    if (properties && properties["usageStartDateLabel"]) {
        agreementInfo["usageStartDateLabel"] = properties["usageStartDateLabel"];
    }
    if (properties && properties["usageEndDateLabel"]) {
        agreementInfo["usageEndDateLabel"] = properties["usageEndDateLabel"];
    }

    if (agreementInfo != null) {
        quotePreview["agreementInfo"] = agreementInfo;
    }

    if (productLines != null) {
        jsonObject["productLines"] = productLines;
    }

    if (quotePreview != null) {
        jsonObject["quotePreview"] = quotePreview;
    }

    if (this.exportXLSRenewalsEndpoint != null && this.serviceData.uiServiceDomain) {
        jsonObject["exportXLSRenewalsEndpoint"] = this.serviceData.uiServiceDomain + this.exportXLSRenewalsEndpoint;
    }

    if (this.renewalDetailsEndpoint && this.serviceData.uiServiceDomain) {
        jsonObject["renewalDetailsEndpoint"] = this.serviceData.uiServiceDomain + this.renewalDetailsEndpoint;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});