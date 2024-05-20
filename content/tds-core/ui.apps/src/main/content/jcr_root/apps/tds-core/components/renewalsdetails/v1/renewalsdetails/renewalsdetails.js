"use strict";
use(['../../../common/utils.js'], function(utils) {
    var jsonObject = {};

    var productLines = {};
    var quotePreview = {};
    var reseller = {};
    var agreementInfo = {};
    var errorMessages = {};
    var endCustomer = {};
    var quoteEditing = {};
    var lineItemDetailLabels = {};
    var requestQuote = {};
    let copyFlyout = {};
    let shareFlyout = {};
    let revisionFlyout = {};
    let noResultsValues = {};

    
    if (properties && properties["line"]) {
        productLines["line"] = properties["line"];
    }

    if (properties && properties["lineItemDetailsLabel"]) {
        productLines["lineItemDetailsLabel"] = properties["lineItemDetailsLabel"];
    }

    if (properties && properties["downloadPDFLabel"]) {
        productLines["downloadPDFLabel"] = properties["downloadPDFLabel"];
    }

    if (properties && properties["showDownloadPDFButton"]) {
        productLines["showDownloadPDFButton"] = properties["showDownloadPDFButton"];
    }

    if (properties && properties["downloadXLSLabel"]) {
        productLines["downloadXLSLabel"] = properties["downloadXLSLabel"];
    }

    if (properties && properties["showDownloadXLSButton"]) {
        productLines["showDownloadXLSButton"] = properties["showDownloadXLSButton"];
    }

    if (properties && properties["shopURL"]) {
        jsonObject["shopURL"] = properties["shopURL"];
    }

    if (properties && properties["productfamily"]) {
        productLines["productfamily"] = properties["productfamily"];
    }
    if (properties && properties["productdescription"]) {
        productLines["productdescription"] = properties["productdescription"];
    }
    if (properties && properties["disableProductDetailsLink"]) {
        productLines["disableProductDetailsLink"] = properties["disableProductDetailsLink"];
    }
    if (properties && properties["vendorPartNo"]) {
        productLines["vendorPartNo"] = properties["vendorPartNo"];
    }
    if (properties && properties["unitPrice"]) {
        productLines["unitPrice"] = properties["unitPrice"];
    }
    if (properties && properties["listPrice"]) {
        productLines["listPrice"] = properties["listPrice"];
    }
    if (properties && properties["percentOffListPrice"]) {
        productLines["percentOffListPrice"] = properties["percentOffListPrice"];
    }
    if (properties && properties["totalPrice"]) {
        productLines["totalPrice"] = properties["totalPrice"];
    }
    if (properties && properties["quantity"]) {
        productLines["quantity"] = properties["quantity"];
    }
    if (properties && properties["quoteSubtotal"]) {
        productLines["quoteSubtotal"] = properties["quoteSubtotal"];
    }
    if (properties && properties["quoteSubtotalCurrency"]) {
        productLines["quoteSubtotalCurrency"] = properties["quoteSubtotalCurrency"];
    }
    if (properties && properties["quoteSubtotalCurrencySymbol"]) {
        productLines["quoteSubtotalCurrencySymbol"] = properties["quoteSubtotalCurrencySymbol"];
    }
     if (properties && properties["quoteTextForFileName"]) {
            productLines["quoteTextForFileName"] = properties["quoteTextForFileName"];
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

    if (this.addressesEndpoint && this.serviceData.uiServiceDomain) {
        quotePreview["addressesEndpoint"] = this.serviceData.uiServiceDomain + this.addressesEndpoint;
    }

    if (this.serviceData && this.serviceData.enableShareOption) {
        jsonObject["enableShareOption"] = this.serviceData.enableShareOption;
    }

    if (this.serviceData && this.serviceData.enableReviseQuote) {
            jsonObject["enableReviseOption"] = this.serviceData.enableReviseQuote;
        }

    if (this.shareQuoteEndpoint && this.serviceData.uiServiceDomain) {
        shareFlyout.shareQuoteEndpoint = this.serviceData.uiServiceDomain + this.shareQuoteEndpoint;
    }

     if (this.reviseQuoteEndpoint && this.serviceData.uiServiceDomain) {
            revisionFlyout.reviseQuoteEndpoint = this.serviceData.uiServiceDomain + this.reviseQuoteEndpoint;
        }


    if (properties && properties["quotePreviewlabel"]) {
        quotePreview["quotePreviewlabel"] = properties["quotePreviewlabel"];
    }

    if (properties && properties["renewalsUrlLabel"]) {
        quotePreview["renewalsUrlLabel"] = properties["renewalsUrlLabel"];
    }
    if (properties && properties["renewalsUrl"]) {
        quotePreview["renewalsUrl"] = properties["renewalsUrl"];
    }
     if (properties && properties["quoteOpportunityText"]) {
            quotePreview["quoteOpportunityText"] = properties["quoteOpportunityText"];
        }

        if (properties && properties["quoteOpportunityRequestLabel"]) {
            quotePreview["quoteOpportunityRequestLabel"] = properties["quoteOpportunityRequestLabel"];
        }
    if (properties && properties["resellerLabel"]) {
        reseller["resellerLabel"] = properties["resellerLabel"];
    }

    if (properties && properties["accountNoLabel"]) {
        reseller["accountNoLabel"] = properties["accountNoLabel"];
    }
    if (properties && properties["resellerVendorAccountNoLabel"]) {
        reseller["resellerVendorAccountNoLabel"] = properties["resellerVendorAccountNoLabel"];
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
    if (properties && properties["shipToLabel"]) {
        reseller["shipToLabel"] = properties["shipToLabel"];
    }
    if (properties && properties["shipToEditLabel"]) {
        reseller["shipToEditLabel"] = properties["shipToEditLabel"];
    }
     if (properties && properties["paymentTerms"]) {
        reseller["paymentTerms"] = properties["paymentTerms"];
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

    if (properties && properties["termLabel"]) {
        agreementInfo["termLabel"] = properties["termLabel"];
    }
    if (properties && properties["supportLevelLabel"]) {
        agreementInfo["supportLevelLabel"] = properties["supportLevelLabel"];
    }
    if (properties && properties["quoteNo"]) {
        agreementInfo["quoteNo"] = properties["quoteNo"];
    } 
    if (properties && properties["agreementNoLabel"]) {
        agreementInfo["agreementNoLabel"] = properties["agreementNoLabel"];
    }
    if (properties && properties["vendorQuoteId"]) {
        agreementInfo["vendorQuoteId"] = properties["vendorQuoteId"];
    }
    if (properties && properties["dueDateLabel"]) {
        agreementInfo["dueDateLabel"] = properties["dueDateLabel"];
    }
    if (properties && properties["quoteExpiryDateLabel"]) {
        agreementInfo["quoteExpiryDateLabel"] = properties["quoteExpiryDateLabel"];
    }
    if (properties && properties["duration"]) {
        agreementInfo["duration"] = properties["duration"];
    }
    if (properties && properties["usageDuration"]) {
        agreementInfo["usageDuration"] = properties["usageDuration"];
    }  
    if (properties && properties["notFoundErrorMessage"]) {
        errorMessages["notFoundErrorMessage"] = properties["notFoundErrorMessage"];
    }
    if (properties && properties["unexpectedErrorMessage"]) {
        errorMessages["unexpectedErrorMessage"] = properties["unexpectedErrorMessage"];
    }
    if (properties && properties["errorLoadingPageTitle"]) {
        errorMessages["errorLoadingPageTitle"] = properties["errorLoadingPageTitle"];
    }

    if (properties && properties["errorLoadingPageRedirect"]) {
        errorMessages["errorLoadingPageRedirect"] = properties["errorLoadingPageRedirect"];
    }

    if (properties && properties["cancelDialogTitle"]) {
        quoteEditing["cancelDialogTitle"] = properties["cancelDialogTitle"];
    }
    if (properties && properties["cancelDialogDescription"]) {
        quoteEditing["cancelDialogDescription"] = properties["cancelDialogDescription"];
    }
    if (properties && properties["successUpdate"]) {
        quoteEditing["successUpdate"] = properties["successUpdate"];
    }
    if (properties && properties["failedUpdate"]) {
        quoteEditing["failedUpdate"] = properties["failedUpdate"];
    }
    if (properties && properties["orderButtonLabel"]) {
        quoteEditing["orderButtonLabel"] = properties["orderButtonLabel"];
    }
    if (properties && properties["saveAndOrderButtonLabel"]) {
        quoteEditing["saveAndOrderButtonLabel"] = properties["saveAndOrderButtonLabel"];
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

    if (errorMessages != null) {
        jsonObject["errorMessages"] = errorMessages;
    }

    if (quotePreview != null) {
        jsonObject["quoteEditing"] = quoteEditing;
    }

    if (this.exportXLSRenewalsEndpoint != null && this.serviceData.uiServiceDomain) {
        jsonObject["exportXLSRenewalsEndpoint"] = this.serviceData.uiServiceDomain + this.exportXLSRenewalsEndpoint;
    }

    if (this.exportPDFRenewalsEndpoint != null && this.serviceData.uiServiceDomain) {
        jsonObject["exportPDFRenewalsEndpoint"] = this.serviceData.uiServiceDomain + this.exportPDFRenewalsEndpoint;
    }

    if (this.renewalDetailsEndpoint && this.serviceData.uiServiceDomain) {
        jsonObject["renewalDetailsEndpoint"] = this.serviceData.uiServiceDomain + this.renewalDetailsEndpoint;
    }

    if (this.updateRenewalOrderEndpoint != null && this.serviceData.uiServiceDomain) {
        jsonObject["updateRenewalOrderEndpoint"] = this.serviceData.uiServiceDomain + this.updateRenewalOrderEndpoint;
    }

    if (this.getStatusEndpoint != null && this.serviceData.uiServiceDomain) {
        jsonObject["getStatusEndpoint"] = this.serviceData.uiServiceDomain + this.getStatusEndpoint;
    }

    if (this.orderRenewalEndpoint != null && this.serviceData.uiServiceDomain) {
        jsonObject["orderRenewalEndpoint"] = this.serviceData.uiServiceDomain + this.orderRenewalEndpoint;
    }

    if (this.disableMultipleAgreement != null) {
        agreementInfo["disableMultipleAgreement"] = this.disableMultipleAgreement;
    }

    if (this.accountLookUpEndpoint && this.serviceData.uiServiceDomain) {
        copyFlyout["accountLookUpEndpoint"] = this.serviceData.uiServiceDomain + this.accountLookUpEndpoint;
    }

    if (this.checkQuoteExitsforResellerEndpoint && this.serviceData.uiServiceDomain) {
        copyFlyout["checkQuoteExitsforResellerEndpoint"] = this.serviceData.uiServiceDomain + this.checkQuoteExitsforResellerEndpoint;
    }

    if (this.copyQuoteEndpoint && this.serviceData.uiServiceDomain) {
        copyFlyout["copyQuoteEndpoint"] = this.serviceData.uiServiceDomain + this.copyQuoteEndpoint;
    }

    const orderingProperties = ["showOrderingIcon","placeOrderDialogTitle","termsAndConditions","termsAndConditionsLink","successSubmission","failedSubmission", "noResponseMessage"]

    if (properties) {
        const orderingFromDashboard = utils.fillFieldsDialogProperties(orderingProperties);
        if (!!orderingFromDashboard) {
            orderingFromDashboard.termsAndConditionsLink = utils.transformUrlGivenEnvironment(orderingFromDashboard.termsAndConditionsLink);

            jsonObject['orderingFromDashboard'] = orderingFromDashboard
        };
    }

    if (properties && properties["hideCopyHeaderOption"]) {
        jsonObject["hideCopyHeaderOption"] = properties["hideCopyHeaderOption"];
    }

    if (properties && properties["hideExportOption"]) {
        jsonObject["hideExportOption"] = properties["hideExportOption"];
    }

    if (properties && properties["copyFlyoutTitle"]) {
        copyFlyout.title = properties["copyFlyoutTitle"];
    }

    if (properties && properties["copyFlyoutDescription"]) {
        copyFlyout.description = properties["copyFlyoutDescription"];
    }

    if (properties && properties["searchLabel"]) {
        copyFlyout.searchLabel = properties["searchLabel"];
    }

    if (properties && properties["searchPlaceholder"]) {
        copyFlyout.searchPlaceholder = properties["searchPlaceholder"];
    }

   if (properties && properties["resellerAccountLabel"]) {
        copyFlyout.resellerAccountLabel = properties["resellerAccountLabel"];
   }

    if (properties && properties["selectedAccountLabel"]) {
        copyFlyout.selectedAccountLabel = properties["selectedAccountLabel"];
    }

    if (properties && properties["accountNumberLabel"]) {
        copyFlyout.accountNumberLabel = properties["accountNumberLabel"];
    }

    if (properties && properties["accountNameLabel"]) {
        copyFlyout.accountNameLabel = properties["accountNameLabel"];
    }

    if (properties && properties["cityLabel"]) {
        copyFlyout.cityLabel = properties["cityLabel"];
    }

    if (properties && properties["permissionsWarning"]) {
        copyFlyout.permissionsWarning = properties["permissionsWarning"];
    }

    if (properties && properties["unknownError"]) {
        copyFlyout.unknownError = properties["unknownError"];
    }

    if (properties && properties["quoteExistsError"]) {
        copyFlyout.quoteExistsError = properties["quoteExistsError"];
    }

    if (properties && properties["accountDoesntExistError"]) {
        copyFlyout.accountDoesntExistError = properties["accountDoesntExistError"];
    }

    if (properties && properties["copySuccessMessage"]) {
        copyFlyout.copySuccessMessage = properties["copySuccessMessage"];
    }

    if (properties && properties["copyFailureMessage"]) {
        copyFlyout.copyFailureMessage = properties["copyFailureMessage"];
    }

    if (properties && properties["copyFlyoutButton"]) {
        copyFlyout.button = properties["copyFlyoutButton"];
    }

    if (copyFlyout != null) {
        jsonObject["copyFlyout"] = copyFlyout;
    }

    if (properties && properties["lineItemSerialNumberLabel"]) {
        lineItemDetailLabels.serialNumberLabel = properties["lineItemSerialNumberLabel"];
    }

    if (properties && properties["lineItemSupportLevelLabel"]) {
        lineItemDetailLabels.supportLevelLabel = properties["lineItemSupportLevelLabel"];
    }

    if (properties && properties["lineItemInstanceLabel"]) {
        lineItemDetailLabels.instanceLabel = properties["lineItemInstanceLabel"];
    }

    if (properties && properties["lineItemDueDateLabel"]) {
        lineItemDetailLabels.dueDateLabel = properties["lineItemDueDateLabel"];
    }

    if (properties && properties["lineItemDurationLabel"]) {
         lineItemDetailLabels.durationLabel = properties["lineItemDurationLabel"];
    }

    if (properties && properties["lineItemUsagePeriodLabel"]) {
         lineItemDetailLabels.usagePeriodLabel = properties["lineItemUsagePeriodLabel"];
    }

    if (lineItemDetailLabels != null) {
        jsonObject["lineItemDetailLabels"] = lineItemDetailLabels;
    }

    if (properties && properties["shareFlyoutTitle"]) {
      shareFlyout.shareFlyoutTitle = properties["shareFlyoutTitle"];
    }

    if (properties && properties["shareFlyoutDescription"]) {
        shareFlyout.shareFlyoutDescription = properties["shareFlyoutDescription"];
    }
     if (properties && properties["emailPreviewDescription"]) {
            shareFlyout.emailPreviewDescription = properties["emailPreviewDescription"];
     }
    if (properties && properties["shareFlyoutQuoteButtonLabel"]) {
        shareFlyout.shareFlyoutQuoteButtonLabel = properties["shareFlyoutQuoteButtonLabel"];
    }
    if (properties && properties["shareFlyoutCommentCountText"]) {
        shareFlyout.shareFlyoutCommentCountText = properties["shareFlyoutCommentCountText"];
    }
    if (properties && properties["shareFlyoutCommentCount"]) {
        shareFlyout.shareFlyoutCommentCount = properties["shareFlyoutCommentCount"];
    }
    if (properties && properties["shareFlyoutSignatureLabel"]) {
        shareFlyout.shareFlyoutSignatureLabel = properties["shareFlyoutSignatureLabel"];
    }
    if (properties && properties["requiredText"]) {
        shareFlyout.requiredText = properties["requiredText"];
    }

    if (properties && properties["shareFlyoutCommentsLabel"]) {
          shareFlyout.shareFlyoutCommentsLabel = properties["shareFlyoutCommentsLabel"];
      }

    if (properties && properties["shareFlyoutQuoteDescription"]) {
        shareFlyout.shareFlyoutQuoteDescription = properties["shareFlyoutQuoteDescription"];
    }

    if (properties && properties["emailToLabel"]) {
        shareFlyout.emailToLabel = properties["emailToLabel"];
    }

    if (properties && properties["emailCCLabel"]) {
        shareFlyout.emailCCLabel = properties["emailCCLabel"];
    }

    if (properties && properties["shareFlyoutButtonLabel"]) {
        shareFlyout.shareFlyoutButtonLabel = properties["shareFlyoutButtonLabel"];
    }

    if (properties && properties["shareFlyoutButtonSharingLabel"]) {
        shareFlyout.shareFlyoutButtonSharingLabel = properties["shareFlyoutButtonSharingLabel"];
    }

    if (this.shareQuoteEndpoint && this.serviceData.uiServiceDomain) {
        shareFlyout.shareQuoteEndpoint = this.serviceData.uiServiceDomain + this.shareQuoteEndpoint;
    }

    if (properties && properties["shareFailedLabel"]) {
        shareFlyout.shareFailedLabel = properties["shareFailedLabel"];
    }
    if (properties && properties["shareFailedDescription"]) {
        shareFlyout.shareFailedDescription = properties["shareFailedDescription"];
    }
    if (properties && properties["shareFailedCancelLabel"]) {
        shareFlyout.shareFailedCancelLabel = properties["shareFailedCancelLabel"];
    }
    if (properties && properties["shareFailedTryAgainLabel"]) {
        shareFlyout.shareFailedTryAgainLabel = properties["shareFailedTryAgainLabel"];
    }
    if (properties && properties["incorrectEmailLabel"]) {
        shareFlyout.incorrectEmailLabel = properties["incorrectEmailLabel"];
    }
    if (properties && properties["incorrectEmailDescription"]) {
        shareFlyout.incorrectEmailDescription = properties["incorrectEmailDescription"];
    }
    if (properties && properties["incorrectEmailCancelLabel"]) {
        shareFlyout.incorrectEmailCancelLabel = properties["incorrectEmailCancelLabel"];
    }
    if (properties && properties["incorrectEmailTryAgainLabel"]) {
        shareFlyout.incorrectEmailTryAgainLabel = properties["incorrectEmailTryAgainLabel"];
    }
    if (properties && properties["recipientNotFoundLabel"]) {
        shareFlyout.recipientNotFoundLabel = properties["recipientNotFoundLabel"];
    }
    if (properties && properties["recipientNotFoundDescription"]) {
        shareFlyout.recipientNotFoundDescription = properties["recipientNotFoundDescription"];
    }
    if (properties && properties["recipientNotFoundCancelLabel"]) {
        shareFlyout.recipientNotFoundCancelLabel = properties["recipientNotFoundCancelLabel"];
    }
    if (properties && properties["recipientNotFoundContinueLabel"]) {
        shareFlyout.recipientNotFoundContinueLabel = properties["recipientNotFoundContinueLabel"];
    }
    if (properties && properties["shareSuccessMessage"]) {
        shareFlyout.shareSuccessMessage = properties["shareSuccessMessage"];
    }

    if (shareFlyout != null) {
        jsonObject["shareFlyout"] = shareFlyout;
    }

    if (properties && properties["requestQuoteHeading"]) {
        requestQuote.requestQuoteHeading = properties["requestQuoteHeading"];
    }
    if (properties && properties["requestQuoteDescription"]) {
        requestQuote.requestQuoteDescription = properties["requestQuoteDescription"];
    }
    if (properties && properties["additionalInformationLabel"]) {
        requestQuote.additionalInformationLabel = properties["additionalInformationLabel"];
    }
    if (properties && properties["additionalInformationPlaceholderText"]) {
        requestQuote.additionalInformationPlaceholderText = properties["additionalInformationPlaceholderText"];
    }
    if (properties && properties["requestQuoteCommentCountText"]) {
        requestQuote.requestQuoteCommentCountText = properties["requestQuoteCommentCountText"];
    }
    if (properties && properties["requestQuoteCommentCount"]) {
        requestQuote.requestQuoteCommentCount = properties["requestQuoteCommentCount"];
    }
    if (properties && properties["requestQuoteButtonLabel"]) {
        requestQuote.requestQuoteButtonLabel = properties["requestQuoteButtonLabel"];
    }
    if (properties && properties["successToastMessage"]) {
        requestQuote.successToastMessage = properties["successToastMessage"];
    }
    if (properties && properties["errorToastMessage"]) {
        requestQuote.errorToastMessage = properties["errorToastMessage"];
    }
    if (properties && properties["quoteRequestedMessage"]) {
        requestQuote.quoteRequestedMessage = properties["quoteRequestedMessage"];
    }

    if (requestQuote != null) {
        jsonObject["requestQuote"] = requestQuote;
    }

    if (this.serviceData && this.serviceData.enableRequestQuote) {
        jsonObject["enableRequestQuote"] = this.serviceData.enableRequestQuote;
    }

    if (properties && properties["requestRevisionHeading"]) {
        revisionFlyout.requestRevisionHeading = properties["requestRevisionHeading"];
    }
    if (properties && properties["requestRevisionDescription"]) {
        revisionFlyout.requestRevisionDescription = properties["requestRevisionDescription"];
    }
    if (properties && properties["additionalInformationLabel"]) {
        revisionFlyout.additionalInformationLabel = properties["additionalInformationLabel"];
    }
    if (properties && properties["additionalInformationPlaceholderText"]) {
        revisionFlyout.additionalInformationPlaceholderText = properties["additionalInformationPlaceholderText"];
    }
    if (properties && properties["requestRevisionCommentCountText"]) {
        revisionFlyout.requestRevisionCommentCountText = properties["requestRevisionCommentCountText"];
    }
    if (properties && properties["requestRevisionCommentCount"]) {
        revisionFlyout.requestRevisionCommentCount = properties["requestRevisionCommentCount"];
    }
    if (properties && properties["requestRevisionButtonLabel"]) {
        revisionFlyout.requestRevisionButtonLabel = properties["requestRevisionButtonLabel"];
    }
    if (properties && properties["successToastMessage"]) {
        revisionFlyout.successToastMessage = properties["successToastMessage"];
    }
    if (properties && properties["errorToastMessage"]) {
        revisionFlyout.errorToastMessage = properties["errorToastMessage"];
    }
    if (properties && properties["revisionRequestedMessage"]) {
        revisionFlyout.revisionRequestedMessage = properties["revisionRequestedMessage"];
    }

    if (revisionFlyout != null) {
        jsonObject["revisionFlyout"] = revisionFlyout;
    }

    if (this.serviceData && this.serviceData.enableRequestRevision) {
        jsonObject["enableRequestRevision"] = this.serviceData.enableRequestRevision;
    }


    if (properties && properties["noDataTitle"]) {
        noResultsValues.noDataTitle = properties["noDataTitle"];
    }

    if (properties && properties["noDataDescription"]) {
        noResultsValues.noDataDescription = properties["noDataDescription"];
    }

   if (properties && properties["noDataImageFileReference"]) {
         noResultsValues.noDataImage = properties["noDataImageFileReference"];
   }

    if (noResultsValues != null) {
           jsonObject["searchResultsError"] = noResultsValues;
      }


    return {
        configJson: JSON.stringify(jsonObject)
    };
});