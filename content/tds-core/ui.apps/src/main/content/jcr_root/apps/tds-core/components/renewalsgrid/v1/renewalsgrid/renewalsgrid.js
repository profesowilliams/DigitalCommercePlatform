/** @format */

"use strict";
use(["../../../common/utils.js"], function (utils) {
  const jsonObject = {};
  const resourceResolver = resource.getResourceResolver();
  const optionData = {};
  const productGrid = {};
  const icons = {};
  const noResultsValues = {};
  const copyFlyout = {};
  const newPurchaseFlyout = {};
  const importFlyout = {};
  const archiveLabels = {};
  const shareFlyout = {};
  const requestQuote = {};
  const revisionFlyout = {};

  if (properties) {
    // Option data
    const optionDataList = [
      "defaultSortingColumnKey",
      "defaultSortingDirection",
    ];

    optionDataList.map(
      (optionDataItem) =>
        (optionData[optionDataItem] =
          properties["./optionData/" + optionDataItem])
    );

    if (optionData != null) {
      jsonObject["options"] = optionData;
    }

    // Product grid
    const productGridList = [
      "quoteIdLabel",
      "multipleLabel",
      "refNoLabel",
      "expiryDateLabel",
      "quoteTextForFileName",
      "downloadPDFLabel",
      "downloadXLSLabel",
      "showDownloadPDFButton",
      "showDownloadXLSButton",
      "showSeeDetailsButton",
      "seeDetailsLabel",
    ];

    productGridList.map(
      (productGridItem) =>
        (productGrid[productGridItem] =
          properties["./productGrid/" + productGridItem])
    );

    if (productGrid != null) {
      jsonObject["productGrid"] = productGrid;
    }

    // Icons
    const overdueProperties = {
      values: ["overdueIcon", "overdueIconColor"],
      propertyName: "overdueDaysRange",
    };
    const thirtyDaysProperties = {
      values: ["afterZeroIcon", "afterZeroIconColor"],
      propertyName: "afterZeroDaysRange",
    };
    const sixtyOneDaysProperties = {
      values: ["afterThirtyIcon", "afterThirtyIconColor"],
      propertyName: "afterThirtyDaysRange",
    };
    const sixtyOnePlusProperties = {
      values: ["sixtyPlusIcon", "sixtyPlusIconColor"],
      propertyName: "sixtyPlusDaysRange",
    };

    function populateOutterProperty(obj, prop, prefix) {
      const populated = utils.fillFieldsDialogPropertiesWithPrefix(
        prop.values,
        prefix
      );
      const daysPropertyName = properties[prefix + prop.propertyName];
      if (populated && daysPropertyName) {
        obj[daysPropertyName] = populated;
      }
    }

    populateOutterProperty(icons, overdueProperties, "./icons/");
    populateOutterProperty(icons, thirtyDaysProperties, "./icons/");
    populateOutterProperty(icons, sixtyOneDaysProperties, "./icons/");
    populateOutterProperty(icons, sixtyOnePlusProperties, "./icons/");

    if (icons != null) {
      jsonObject["icons"] = icons;
    }

    // Ordering properties
    const orderingPropertiesList = [
      "showOrderingIcon",
      "placeOrderDialogTitle",
      "termsAndConditions",
      "termsAndConditionsLink",
      "successSubmission",
      "failedSubmission",
      "noResponseMessage",
    ];

    const orderingFromDashboard = utils.fillFieldsDialogPropertiesWithPrefix(
      orderingPropertiesList,
      "./orderingFromDashboard/"
    );
    if (orderingFromDashboard != null) {
      orderingFromDashboard.termsAndConditionsLink = utils.addHtmlIfNeeded(
        utils.transformUrlGivenEnvironment(
          orderingFromDashboard.termsAndConditionsLink
        )
      );
      jsonObject["orderingFromDashboard"] = orderingFromDashboard;
    }

    // No result value
    const noResultsValuesList = [
      "noResultsTitle",
      "noResultsDescription",
      "noDataTitle",
      "noDataDescription",
    ];

    noResultsValuesList.map(
      (noResultsValuesItem) =>
        (noResultsValues[noResultsValuesItem] =
          properties["./searchResultsError/" + noResultsValuesItem])
    );

    if (
      properties["./searchResultsError/noResultsImageFileReference"] != null
    ) {
      noResultsValues.noResultsImage =
        properties["./searchResultsError/noResultsImageFileReference"];
    }

    if (properties["./searchResultsError/noDataImageFileReference"] != null) {
      noResultsValues.noDataImage =
        properties["./searchResultsError/noDataImageFileReference"];
    }

    if (noResultsValues != null) {
      jsonObject["searchResultsError"] = noResultsValues;
    }

    // Copy flyout
    if (this.accountLookUpEndpoint && this.serviceData.uiServiceDomain) {
      copyFlyout["accountLookUpEndpoint"] =
        this.serviceData.uiServiceDomain + this.accountLookUpEndpoint;
    }

    if (
      this.checkQuoteExitsforResellerEndpoint &&
      this.serviceData.uiServiceDomain
    ) {
      copyFlyout["checkQuoteExitsforResellerEndpoint"] =
        this.serviceData.uiServiceDomain +
        this.checkQuoteExitsforResellerEndpoint;
    }

    if (this.copyQuoteEndpoint && this.serviceData.uiServiceDomain) {
      copyFlyout["copyQuoteEndpoint"] =
        this.serviceData.uiServiceDomain + this.copyQuoteEndpoint;
    }

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
      "copyFailureMessage",
    ];

    copyFlyoutList.map(
      (copyFlyoutItem) =>
        (copyFlyout[copyFlyoutItem] =
          properties["./copyFlyout/" + copyFlyoutItem])
    );

    if (properties["./copyFlyout/copyFlyoutTitle"] != null) {
      copyFlyout.title = properties["./copyFlyout/copyFlyoutTitle"];
    }

    if (properties["./copyFlyout/copyFlyoutDescription"] != null) {
      copyFlyout.description = properties["./copyFlyout/copyFlyoutDescription"];
    }

    if (properties["./copyFlyout/copyFlyoutButton"] != null) {
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
      "productNotFound",
      "yourOrderFor",
      "hasBeenSuccessfullySubmittedForProcessing",
      "adobeResellerTermsAndConditionsLinkNewPurchase",
      "noMatchFoundPleaseTryAgain",
      "pleaseEnterAValidPostalCode",
    ];

    newPurchaseFlyoutList.map(
      (property) =>
        (newPurchaseFlyout[property] =
          properties["./newPurchaseFlyout/" + property])
    );

    if (properties["./newPurchaseFlyout/termsAndConditionsLinkNewPurchase"]) {
      newPurchaseFlyout["termsAndConditionsLinkNewPurchase"] =
        utils.addHtmlIfNeeded(
          utils.transformUrlGivenEnvironment(
            properties["./newPurchaseFlyout/termsAndConditionsLinkNewPurchase"]
          )
        );
    }

    if (
      properties[
        "./newPurchaseFlyout/adobeResellerTermsAndConditionsLinkNewPurchase"
      ]
    ) {
      newPurchaseFlyout["adobeResellerTermsAndConditionsLinkNewPurchase"] =
        utils.addHtmlIfNeeded(
          utils.transformUrlGivenEnvironment(
            properties[
              "./newPurchaseFlyout/adobeResellerTermsAndConditionsLinkNewPurchase"
            ]
          )
        );
    }

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
        this.serviceData.uiServiceDomain + this.createNewPurchaseOrderEndpoint;
    }

    // Import Flyout
    const importFlyoutList = [
      "importTitle",
      "completeTheRequiredFields",
      "vendorImport",
      "vendorProgram",
      "uploadTemplateFile",
      "dragAndDrop",
      "maxSizeOf",
      "browseFile",
      "importButton",
      "confirmationCompleteMessage",
    ];
    importFlyoutList.map(
      (importFlyoutItem) =>
        (importFlyout[importFlyoutItem] =
          properties["./importFlyout/" + importFlyoutItem])
    );
    if (importFlyout != null) {
      jsonObject["importFlyout"] = importFlyout;
    }

    // Archive Labels
    const archiveLabelsList = ["archive", "restore"];
    archiveLabelsList.map(
      (archiveLabelsItem) =>
        (archiveLabels[archiveLabelsItem] =
          properties["./archiveLabels/" + archiveLabelsItem])
    );
    if (archiveLabels != null) {
      jsonObject["archiveLabels"] = archiveLabels;
    }

    // Share Flyout
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
      "shareFlyoutButtonLabel",
      "shareFlyoutButtonSharingLabel",
      "shareFailedLabel",
      "shareFailedDescription",
      "shareFailedCancelLabel",
      "shareFailedTryAgainLabel",
      "incorrectEmailLabel",
      "incorrectEmailDescription",
      "incorrectEmailTryAgainLabel",
      "recipientNotFoundLabel",
      "recipientNotFoundDescription",
      "recipientNotFoundCancelLabel",
      "recipientNotFoundContinueLabel",
      "shareSuccessMessage",
      "emailCCLabel",
    ];

    if (this.shareQuoteEndpoint && this.serviceData.uiServiceDomain) {
      shareFlyout.shareQuoteEndpoint =
        this.serviceData.uiServiceDomain + this.shareQuoteEndpoint;
    }

    shareFlyoutList.map(
      (shareFlyoutItem) =>
        (shareFlyout[shareFlyoutItem] =
          properties["./shareFlyout/" + shareFlyoutItem])
    );

    if (shareFlyout != null) {
      jsonObject["shareFlyout"] = shareFlyout;
    }

    // Request Quote
    const requestQuoteList = [
      "requestQuoteHeading",
      "requestedQuoteHeading",
      "requestQuoteDescription",
      "additionalInformationLabel",
      "additionalInformationPlaceholderText",
      "requestQuoteButtonLabel",
      "successToastMessage",
      "requestQuoteCommentCountText",
      "requestQuoteCommentCount",
      "errorToastMessage",
      "quoteRequestedMessageToolTip",
      "toolTipSuccessMessage",
    ];

    if (this.requestQuoteEndpoint && this.serviceData.uiServiceDomain) {
      requestQuote.requestQuoteEndpoint =
        this.serviceData.uiServiceDomain + this.requestQuoteEndpoint;
    }

    requestQuoteList.map(
      (requestQuoteItem) =>
        (requestQuote[requestQuoteItem] =
          properties["./requestQuote/" + requestQuoteItem])
    );

    if (requestQuote != null) {
      jsonObject["requestQuote"] = requestQuote;
    }

    // Revision Flyout
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
      "revisionRequestedMessage",
    ];

    revisionFlyoutList.map(
      (revisionFlyoutItem) =>
        (revisionFlyout[revisionFlyoutItem] =
          properties["./revisionFlyout/" + revisionFlyoutItem])
    );

    if (revisionFlyout != null) {
      jsonObject["revisionFlyout"] = revisionFlyout;
    }

    // Label list
    const labelList = [
      "displayCurrencyName",
      "itemsPerPage",
      "paginationStyle",
      "filterTitle",
      "clearAllFilterTitle",
      "showResultLabel",
      "menuCopy",
      "menuCopyWithHeaders",
      "menuExport",
      "menuCsvExport",
      "menuExcelExport",
      "menuOpenLink",
      "menuCopyLink",
      "ofTextLabel",
      "filterType",
      "hideCopyHeaderOption",
      "hideExportOption",
      "import",
      "genericError",
      "genericErrorCode",
      "showArchive",
    ];

    labelList.map((labelListItem) => {
      if (properties["./labels/" + labelListItem]) {
        jsonObject[labelListItem] = properties["./labels/" + labelListItem];
      }
    });

    if (properties["./labels/detailUrl"] != null) {
      jsonObject["detailUrl"] = utils.transformUrlGivenEnvironment(
        properties["./labels/detailUrl"]
      );
    }

    if (properties["./labels/shopPath"] != null) {
      jsonObject["shopURL"] = properties["./labels/shopPath"];
    }

    if (properties["./labels/disableDefaultSort"]) {
      jsonObject["disableDefaultSort"] =
        properties["./labels/disableDefaultSort"];
    } else if (
      properties["./labels/disableDefaultSort"] == null ||
      !properties["./labels/disableDefaultSort"]
    ) {
      jsonObject["./labels/disableDefaultSort"] = false;
    }

    if (this.serviceData && this.serviceData.enableShareOption) {
      jsonObject["enableShareOption"] = this.serviceData.enableShareOption;
    }

    if (this.serviceData && this.serviceData.enableNewPurchaseAction) {
      jsonObject["enableNewPurchaseAction"] =
        this.serviceData.enableNewPurchaseAction;
    }

    if (this.serviceData && this.serviceData.enableImport) {
      jsonObject["enableImport"] = this.serviceData.enableImport;
    }

    if (this.serviceData && this.serviceData.enableArchiveQuote) {
      jsonObject["enableArchiveQuote"] = this.serviceData.enableArchiveQuote;
    }

    if (this.serviceData && this.serviceData.enableReviseOption) {
      jsonObject["enableReviseOption"] = this.serviceData.enableReviseOption;
    }

    if (this.serviceData && this.serviceData.enableRequestQuote) {
      jsonObject["enableRequestQuote"] = this.serviceData.enableRequestQuote;
    }

    //Column definition
    let columnListValues = utils.getDataFromMultifield(
      resourceResolver,
      "columnList",
      function (childResource) {
        let itemData = {};

        itemData.columnLabel = childResource.properties["columnLabel"];
        itemData.columnKey = childResource.properties["columnKey"];
        itemData.sortable = childResource.properties["sortable"];
        itemData.type = childResource.properties["columnType"];

        return itemData;
      }
    );

    if (columnListValues != null) {
      jsonObject["columnList"] = columnListValues;
    }

    //Search Options
    let searchOptionsValues = utils.getDataFromMultifield(
      resourceResolver,
      "searchOptionsList",
      function (childResource) {
        let itemData = {};
        itemData.searchLabel = childResource.properties["searchLabel"];
        itemData.searchKey = childResource.properties["searchKey"];
        itemData.showIfIsHouseAccount =
          childResource.properties["showIfIsHouseAccount"];
        return itemData;
      }
    );

    if (searchOptionsValues != null) {
      jsonObject["searchOptionsList"] = searchOptionsValues;
    }

    let dateOptionValues = utils.getDataFromMultifield(
      resourceResolver,
      "dateOptionsList",
      function (childResource) {
        let itemData = {};
        itemData.label = childResource.properties["label"];
        itemData.field = childResource.properties["field"];
        return itemData;
      }
    );

    if (dateOptionValues != null) {
      jsonObject["dateOptionValues"] = dateOptionValues;
    }

    jsonObject["uiServiceEndPoint"] =
      this.serviceData.uiServiceDomain +
        this.serviceData.renewalsGridEndpoint || "";

    if (this.agGridLicenseKey) {
      jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
    }

    let node = resourceResolver.getResource(
      currentNode.getPath() + "/filterList"
    );

    let filterListValues = [];
    if (node !== null) {
      let childrenList = node.getChildren();
      for (let [key, res] in Iterator(childrenList)) {
        let accordionLabel = res.properties["accordionLabel"];
        let filterField = res.properties["filterField"];
        let itemData = {};
        itemData.accordionLabel = accordionLabel;
        itemData.filterField = filterField;
        let childNode = resourceResolver.getResource(
          res.getPath() + "/filtersOptionsList"
        );

        if (childNode != null) {
          itemData.filterOptionsValues = [];
          let childNodeList = childNode.getChildren();
          for (let [childkey, childRes] in Iterator(childNodeList)) {
            let childDataItem = {};
            let filterOptionLabel = childRes.properties["filterOptionLabel"];
            childDataItem.filterOptionLabel = filterOptionLabel;
            let subChildNode = resourceResolver.getResource(
              childRes.getPath() + "/subFilterOptionList"
            );

            if (subChildNode != null) {
              let subFilterOptionsValues = [];
              let subChildNodeList = subChildNode.getChildren();

              for (let [subChildKey, subChildRes] in Iterator(
                subChildNodeList
              )) {
                let subChildDataItem = {};
                subChildDataItem.subFilterOptionsLabel =
                  subChildRes.properties["subFilterOptionsLabel"];
                subFilterOptionsValues.push(subChildDataItem);
              }
              childDataItem.subFilterOptionsValues = subFilterOptionsValues;
            }
            itemData.filterOptionsValues.push(childDataItem);
          }
        }
        filterListValues.push(itemData);
      }
    }

    if (filterListValues != null) {
      jsonObject["filterListValues"] = filterListValues;
    }

    if (
      this.exportXLSRenewalsEndpoint != null &&
      this.serviceData.uiServiceDomain
    ) {
      jsonObject["exportXLSRenewalsEndpoint"] =
        this.serviceData.uiServiceDomain + this.exportXLSRenewalsEndpoint;
    }

    if (
      this.exportPDFRenewalsEndpoint != null &&
      this.serviceData.uiServiceDomain
    ) {
      jsonObject["exportPDFRenewalsEndpoint"] =
        this.serviceData.uiServiceDomain + this.exportPDFRenewalsEndpoint;
    }

    if (
      this.updateRenewalOrderEndpoint != null &&
      this.serviceData.uiServiceDomain
    ) {
      jsonObject["updateRenewalOrderEndpoint"] =
        this.serviceData.uiServiceDomain + this.updateRenewalOrderEndpoint;
    }

    if (this.getStatusEndpoint != null && this.serviceData.uiServiceDomain) {
      jsonObject["getStatusEndpoint"] =
        this.serviceData.uiServiceDomain + this.getStatusEndpoint;
    }

    if (this.orderRenewalEndpoint != null && this.serviceData.uiServiceDomain) {
      jsonObject["orderRenewalEndpoint"] =
        this.serviceData.uiServiceDomain + this.orderRenewalEndpoint;
    }

    if (this.renewalDetailsEndpoint && this.serviceData.uiServiceDomain) {
      jsonObject["renewalDetailsEndpoint"] =
        this.serviceData.uiServiceDomain + this.renewalDetailsEndpoint;
    }
  }
  return {
    configJson: JSON.stringify(jsonObject),
  };
});
