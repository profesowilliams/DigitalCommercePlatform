"use strict";
use(["../../../common/utils.js"], function(utils) {
    const jsonObject = {};
    const productLines = {};
    const quotePreview = {};
    const reseller = {};
    const agreementInfo = {};
    const errorMessages = {};
    const endCustomer = {};
    const quoteEditing = {};
    const lineItemDetailLabels = {};
    const requestQuote = {};
    const copyFlyout = {};
    const newPurchaseFlyout = {};
    const shareFlyout = {};
    const revisionFlyout = {};
    const noResultsValues = {};

    if (properties) {

        // Product lines
        const productLinesList = [
            "line",
            "lineItemDetailsLabel",
            "lineActiveLicenceLabel",
            "addMoreButton",
            "lineRenewalDetailsLabel",
            "downloadPDFLabel",
            "showDownloadPDFButton",
            "downloadXLSLabel",
            "showDownloadXLSButton",
            "productfamily",
            "productdescription",
            "disableProductDetailsLink",
            "enableActiveLicence",
            "vendorPartNo",
            "unitPrice",
            "listPrice",
            "percentOffListPrice",
            "totalPrice",
            "quantity",
            "quoteSubtotal",
            "quoteSubtotalCurrency",
            "quoteSubtotalCurrencySymbol",
            "quoteTextForFileName",
            "migrationNote",
            "adobeNote",
            "yourOrderFor",
            "hasBeenSuccessfullySubmittedForProcessing",
            "note",
            "menuCopy",
            "menuCopyWithHeaders",
            "menuExport",
            "menuCsvExport",
            "menuExcelExport",
            "menuOpenLink",
            "menuCopyLink",
            "hideCopyHeaderOption",
            "hideExportOption",
            "shopURL"
        ];

        productLinesList.map((productLinesItem) =>
            (productLines[productLinesItem] = properties["./productLines/" + productLinesItem])
        );

        if (productLines != null) {
            jsonObject["productLines"] = productLines;
        }

        // Quote Preview
        const quotePreviewList = [
            "quotePreviewlabel",
            "renewalsUrlLabel",
            "quoteOpportunityText",
            "quoteOpportunityRequestLabel"
        ];

        if (properties["./quotePreview/renewalsUrl"]) {
            quotePreview["renewalsUrl"] = utils.addHtmlIfNeeded(utils.transformUrlGivenEnvironment(properties["./quotePreview/renewalsUrl"]));
        }

        if (this.addressesEndpoint && this.serviceData.uiServiceDomain) {
            quotePreview["addressesEndpoint"] = this.serviceData.uiServiceDomain + this.addressesEndpoint;
        }

        quotePreviewList.map((quotePreviewItem) =>
            (quotePreview[quotePreviewItem] = properties["./quotePreview/" + quotePreviewItem])
        );

        // Reseller
        const ResellerList = [
            "resellerLabel",
            "accountNoLabel",
            "resellerVendorAccountNoLabel",
            "previousPurchaseOrderNoLabel",
            "resellerSAPaccNoLabel",
            "previousResellerorderNoLabel",
            "typeEndUserLabel",
            "vendorAccountNoResLabel",
            "previousPurchaseOrderNoEndLabel",
            "previousOrderNoLabel",
            "shipToLabel",
            "shipToEditLabel",
            "paymentTerms"
        ];

        ResellerList.map((resellerItem) =>
            (reseller[resellerItem] = properties["./reseller/" + resellerItem])
        );

        if (reseller != null) {
            quotePreview["reseller"] = reseller;
        }

        // End customer
        const endCustomerList = [
            "endCustomerLabel",
            "emailLabel",
            "phoneLabel",
            "endCustomerType",
            "vendorAccountNo",
            "endCustpreviousPurchaseOrderNo"
        ];

        endCustomerList.map((endCustomerItem) =>
            (endCustomer[endCustomerItem] = properties[endCustomerItem])
        );

        if (endCustomer != null) {
            quotePreview["productLines"] = endCustomer;
        }

        // Argument info
        const agreementInfoList = [
            "agreementInfoLabel",
            "programLabel",
            "termLabel",
            "supportLevelLabel",
            "quoteNo",
            "agreementNoLabel",
            "vendorQuoteId",
            "dueDateLabel",
            "quoteExpiryDateLabel",
            "duration",
            "usageDuration"
        ];

        if (this.disableMultipleAgreement != null) {
            agreementInfo["disableMultipleAgreement"] = this.disableMultipleAgreement;
        }

        agreementInfoList.map((agreementInfoItem) =>
            (agreementInfo[agreementInfoItem] = properties["./agreementInfo/" + agreementInfoItem])
        );

        if (agreementInfo != null) {
            quotePreview["agreementInfo"] = agreementInfo;
        }

        // Add final Quote Preview to json object
        if (quotePreview != null) {
            jsonObject["quotePreview"] = quotePreview;
        }

        // Error Messages
        const errorMessagesList = [
            "notFoundErrorMessage",
            "unexpectedErrorMessage",
            "errorLoadingPageTitle",
            "errorLoadingPageRedirect"
        ];

        errorMessagesList.map((errorMessagesItem) =>
            (errorMessages[errorMessagesItem] = properties["./errorMessages/" + errorMessagesItem])
        );

        if (errorMessages != null) {
            jsonObject["errorMessages"] = errorMessages;
        }

        // Quote Editing
        const quoteEditingList = [
            "cancelDialogTitle",
            "cancelDialogDescription",
            "successUpdate",
            "failedUpdate",
            "orderButtonLabel",
            "saveAndOrderButtonLabel"
        ];

        quoteEditingList.map((quoteEditingItem) =>
            (quoteEditing[quoteEditingItem] = properties["./quoteEditing/" + quoteEditingItem])
        );

        if (quoteEditing != null) {
            jsonObject["quoteEditing"] = quoteEditing;
        }

        // Line item detail labels
        if (properties["./lineItemDetailLabels/lineItemSerialNumberLabel"]) {
            lineItemDetailLabels.serialNumberLabel = properties["./lineItemDetailLabels/lineItemSerialNumberLabel"];
        }

        if (properties["./lineItemDetailLabels/lineItemSupportLevelLabel"]) {
            lineItemDetailLabels.supportLevelLabel = properties["./lineItemDetailLabels/lineItemSupportLevelLabel"];
        }

        if (properties["./lineItemDetailLabels/lineItemInstanceLabel"]) {
            lineItemDetailLabels.instanceLabel = properties["./lineItemDetailLabels/lineItemInstanceLabel"];
        }

        if (properties["./lineItemDetailLabels/lineItemDueDateLabel"]) {
            lineItemDetailLabels.dueDateLabel = properties["./lineItemDetailLabels/lineItemDueDateLabel"];
        }

        if (properties["./lineItemDetailLabels/lineItemDurationLabel"]) {
             lineItemDetailLabels.durationLabel = properties["./lineItemDetailLabels/lineItemDurationLabel"];
        }

        if (properties["./lineItemDetailLabels/lineItemUsagePeriodLabel"]) {
             lineItemDetailLabels.usagePeriodLabel = properties["./lineItemDetailLabels/lineItemUsagePeriodLabel"];
        }
        if (properties["./lineItemDetailLabels/activeSubscriptionId"]) {
             lineItemDetailLabels.subscriptionId = properties["./lineItemDetailLabels/activeSubscriptionId"];
        }

        if (lineItemDetailLabels != null) {
            jsonObject["lineItemDetailLabels"] = lineItemDetailLabels;
        }

        // Request quote
        const requestQuoteList = [
            "requestQuoteHeading",
            "requestQuoteDescription",
            "additionalInformationLabel",
            "additionalInformationPlaceholderText",
            "requestQuoteCommentCountText",
            "requestQuoteButtonLabel",
            "successToastMessage",
            "errorToastMessage",
            "quoteRequestedMessage"
        ];

        requestQuoteList.map((requestQuoteItem) =>
            (requestQuote[requestQuoteItem] = properties["./requestQuote/" + requestQuoteItem])
        );

       if (this.requestQuoteEndpoint && this.serviceData.uiServiceDomain) {
            requestQuote.requestQuoteEndpoint = this.serviceData.uiServiceDomain + this.requestQuoteEndpoint;
       }

        if (requestQuote != null) {
            jsonObject["requestQuote"] = requestQuote;
        }

        // Copy flyout
        const copyFlyoutList = [
            "searchLabel",
            "searchPlaceholder",
            "resellerAccountLabel",
            "selectedAccountLabel",
            "accountNumberLabel",
            "accountNameLabel",
            "cityLabel",
            "permissionsWarning",
            "unknownError",
            "quoteExistsError",
            "accountDoesntExistError",
            "copySuccessMessage",
            "copyFailureMessage"
        ];

        copyFlyoutList.map((copyFlyoutItem) =>
            (copyFlyout[copyFlyoutItem] = properties["./copyFlyout/" + copyFlyoutItem])
        );

        if (this.accountLookUpEndpoint && this.serviceData.uiServiceDomain) {
            copyFlyout["accountLookUpEndpoint"] = this.serviceData.uiServiceDomain + this.accountLookUpEndpoint;
        }

        if (this.checkQuoteExitsforResellerEndpoint && this.serviceData.uiServiceDomain) {
            copyFlyout["checkQuoteExitsforResellerEndpoint"] = this.serviceData.uiServiceDomain + this.checkQuoteExitsforResellerEndpoint;
        }

        if (this.copyQuoteEndpoint && this.serviceData.uiServiceDomain) {
            copyFlyout["copyQuoteEndpoint"] = this.serviceData.uiServiceDomain + this.copyQuoteEndpoint;
        }

        if (properties["./copyFlyout/copyFlyoutTitle"]) {
            copyFlyout.title = properties["./copyFlyout/copyFlyoutTitle"];
        }

        if (properties["./copyFlyout/copyFlyoutDescription"]) {
            copyFlyout.description = properties["./copyFlyout/copyFlyoutDescription"];
        }

        if (properties["./copyFlyout/copyFlyoutButton"]) {
            copyFlyout.button = properties["./copyFlyout/copyFlyoutButton"];
        }

        if (copyFlyout != null) {
            jsonObject["copyFlyout"] = copyFlyout;
        }

         // New Purchase Flyout
            const newPurchaseFlyoutList = [
              "resellerAccountNumber",
              "search",
              "required",
              "exceeds35CharacterLimit",
              "invalidEmail",
              "exceeds40CharacterLimit",
              "exceeds10CharacterLimit",
              "next",
              "cancel",
              "newPurchase",
              "newPurchaseBanner",
              "agreementDetails",
              "description",
              "indicatedRequiredField",
              "resellerContact",
              "contactFirstName",
              "contactLastName",
              "contactEmail",
              "endUserContact",
              "endUserCompanyName",
              "endUserContactFirstName",
              "endUserContactLastName",
              "endUserEmail",
              "endUserType",
              "endUserTypeComercial",
              "endUserTypeEducation",
              "endUserTypeGovernment",
              "endUserAddress",
              "endUserAdress1",
              "endUserAdress2",
              "endUserCity",
              "endUserAreaCode",
              "endUserCountry",
              "endUserVietnam",
              "endUserCambodia",
              "endUserLaos",
              "back",
              "placeOrder",
              "orderDetails",
              "resellerDetails",
              "endUserDetails",
              "endUserAddress",
              "addProducts",
              "searchForAdditionalSoftware",
              "searchVendorPartNo",
              "startDate",
              "endDate",
              "duration",
              "licensePriceLevel",
              "productDetails",
              "vendorPartNoNewPurchase",
              "listPriceNewPurchase",
              "unitPriceNewPurchase",
              "qty",
              "totalPriceNewPurchase",
              "subtotal",
              "resellerSubtotal",
              "taxesNotIncluded",
              "days",
              "validateOrder",
              "validating",
              "unknownErrorNewPurchase",
              "accountDoesntExistErrorNewPurchase",
              "quoteExistsErrorNewPurchase",
              "modifyOrder",
              "completeOrder",
              "toCompletePlacingYourOrderFor",
              "pleaseProvideTheFollowingInformation",
              "purchaseOrderNumber",
              "max35Characters",
              "iConfirmIAmAuthorizedByAdobe",
              "iHaveReadAndAcceptThe",
              "techDataTermsConditions",
              "the",
              "adobeTermsConditions",
              "adobeResellerTermsAndConditionsLink",
              "termsAndConditionsLinkNewPurchase",
              "placeOrderSuccess",
              "productNotFound",
            ];

            newPurchaseFlyoutList.map(
              (property) => (newPurchaseFlyout[property] = properties["./newPurchaseFlyout/" + property])
            );

            if (newPurchaseFlyout != null) {
              jsonObject["newPurchaseFlyout"] = newPurchaseFlyout;
            }
           if (this.vendorPartNoLookUpEndpoint && this.serviceData.uiServiceDomain) {
             newPurchaseFlyout.vendorPartNoLookUpEndpoint =
               this.serviceData.uiServiceDomain + this.vendorPartNoLookUpEndpoint;
           }
           if (this.addNewProductEndpoint && this.serviceData.uiServiceDomain) {
             newPurchaseFlyout.addNewProductEndpoint =
               this.serviceData.uiServiceDomain + this.addNewProductEndpoint;
           }
           if (
             this.createNewPurchaseOrderEndpoint &&
             this.serviceData.uiServiceDomain
           ) {
             newPurchaseFlyout.createNewPurchaseOrderEndpoint =
               this.serviceData.uiServiceDomain +
               this.createNewPurchaseOrderEndpoint;
           }

        // Share flyout
        const shareFlyoutList = [
            "shareFlyoutTitle",
            "shareFlyoutDescription",
            "emailPreviewDescription",
            "shareFlyoutQuoteButtonLabel",
            "shareFlyoutCommentCountText",
            "shareFlyoutCommentCount",
            "shareFlyoutSignatureLabel",
            "requiredText",
            "shareFlyoutCommentsLabel",
            "shareFlyoutQuoteDescription",
            "emailToLabel",
            "emailCCLabel",
            "shareFlyoutButtonLabel",
            "shareFlyoutButtonSharingLabel",
            "shareFailedLabel",
            "shareFailedDescription",
            "shareFailedCancelLabel",
            "shareFailedTryAgainLabel",
            "incorrectEmailLabel",
            "incorrectEmailDescription",
            "incorrectEmailCancelLabel",
            "incorrectEmailTryAgainLabel",
            "recipientNotFoundLabel",
            "recipientNotFoundDescription",
            "recipientNotFoundCancelLabel",
            "recipientNotFoundCancelLabel",
            "recipientNotFoundContinueLabel",
            "shareSuccessMessage"
        ];

        shareFlyoutList.map((shareFlyoutItem) =>
            (shareFlyout[shareFlyoutItem] = properties["./shareFlyout/" + shareFlyoutItem])
        );

        if (this.shareQuoteEndpoint && this.serviceData.uiServiceDomain) {
            shareFlyout.shareQuoteEndpoint = this.serviceData.uiServiceDomain + this.shareQuoteEndpoint;
        }

        if (this.shareQuoteEndpoint && this.serviceData.uiServiceDomain) {
            shareFlyout.shareQuoteEndpoint = this.serviceData.uiServiceDomain + this.shareQuoteEndpoint;
        }

        if (shareFlyout != null) {
            jsonObject["shareFlyout"] = shareFlyout;
        }

        // Revision flyout
        const revisionFlyoutList = [
            "requestRevisionHeading",
            "requestRevisionDescription",
            "additionalInformationLabel",
            "additionalInformationPlaceholderText",
            "requestRevisionCommentCountText",
            "requestRevisionCommentCount",
            "requestRevisionButtonLabel",
            "successToastMessage",
            "errorToastMessage",
            "revisionRequestedMessage"
        ];

        revisionFlyoutList.map((revisionFlyoutItem) =>
            (revisionFlyout[revisionFlyoutItem] = properties["./revisionFlyout/" + revisionFlyoutItem])
        );

        if (this.reviseQuoteEndpoint && this.serviceData.uiServiceDomain) {
            revisionFlyout.reviseQuoteEndpoint = this.serviceData.uiServiceDomain + this.reviseQuoteEndpoint;
        }

        if (revisionFlyout != null) {
            jsonObject["revisionFlyout"] = revisionFlyout;
        }

        // No result values
        const noResultsValuesList = [
            "noDataTitle",
            "noDataDescription",
            "noDataImageFileReference"
        ];

        noResultsValuesList.map((noResultsValuesItem) =>
            (noResultsValues[noResultsValuesItem] = properties["./searchResultsError/" + noResultsValuesItem])
        );

        if (noResultsValues != null) {
            jsonObject["searchResultsError"] = noResultsValues;
        }

        if (this.agGridLicenseKey) {
            jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
        }

        if (this.shopDomainPage !== null) {
            jsonObject["shopDomainPage"] = this.shopDomainPage;
        }

        if (this.serviceData.renewalDetailLineItemEndpoint) {
            jsonObject["uiServiceEndPoint"] = this.serviceData.uiServiceDomain + this.serviceData.renewalDetailLineItemEndpoint || "";
        }

        if (this.serviceData && this.serviceData.enableShareOption) {
            jsonObject["enableShareOption"] = this.serviceData.enableShareOption;
        }

        if (this.serviceData && this.serviceData.enableReviseOption) {
                jsonObject["enableReviseOption"] = this.serviceData.enableReviseOption;
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

        if (this.uiServiceDomain){
            jsonObject["uiServiceDomain"] = this.uiServiceDomain;
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

        if (this.serviceData && this.serviceData.enableRequestQuote) {
            jsonObject["enableRequestQuote"] = this.serviceData.enableRequestQuote;
        }

        if (this.serviceData && this.serviceData.enableRequestRevision) {
            jsonObject["enableRequestRevision"] = this.serviceData.enableRequestRevision;
        }

        const orderingProperties = [
          "showOrderingIcon",
          "placeOrderDialogTitle",
          "termsAndConditions",
          "termsAndConditionsLink",
          "adobeResellerTermsAndConditionsLink",
          "successSubmission",
          "failedSubmission",
          "noResponseMessage"
        ];
        const orderingFromDashboard =
            utils.fillFieldsDialogProperties(orderingProperties, "./orderingProperties/");
        if (!!orderingFromDashboard) {
        orderingFromDashboard.termsAndConditionsLink = utils.addHtmlIfNeeded(
          utils.transformUrlGivenEnvironment(
            orderingFromDashboard.termsAndConditionsLink
          )
        );
            jsonObject["orderingFromDashboard"] = orderingFromDashboard;
        }
    }
    return {
        configJson: JSON.stringify(jsonObject)
    };
});
