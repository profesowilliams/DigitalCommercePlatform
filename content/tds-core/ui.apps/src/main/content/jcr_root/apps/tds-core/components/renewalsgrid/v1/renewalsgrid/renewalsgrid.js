"use strict";
use(['../../../common/utils.js'], function(utils) {
    let jsonObject = {};
    let resourceResolver = resource.getResourceResolver();
    let optionData = {};
    var productGrid = {};
    let icons = {};
    let noResultsValues = {};
    let copyFlyout = {};
    let shareFlyout = {};

    if (properties && properties["detailUrl"]) {
        jsonObject["detailUrl"] = properties["detailUrl"];
    }

    if (properties && properties["displayCurrencyName"]) {
      jsonObject["displayCurrencyName"] = properties["displayCurrencyName"];
    }

    if (properties) {
      if (properties["disableDefaultSort"]) {
         jsonObject["disableDefaultSort"] = properties["disableDefaultSort"];
      }else if (properties["disableDefaultSort"] == null || !properties["disableDefaultSort"]) {
           jsonObject["disableDefaultSort"] = false;
        }

    }

    if (this.serviceData && this.serviceData.enableShareOption) {
        jsonObject["enableShareOption"] = this.serviceData.enableShareOption;
    }

    //Column definition

    let columnListValues = utils.getDataFromMultifield(resourceResolver, "columnList", function(childResource) {
        let itemData = {};

        itemData.columnLabel = childResource.properties["columnLabel"];
        itemData.columnKey = childResource.properties["columnKey"];
        itemData.sortable = childResource.properties["sortable"];
        itemData.type = childResource.properties["columnType"];

        return itemData;
    });

    if (columnListValues != null) {
        jsonObject["columnList"] = columnListValues;
    }

    //Search Options
    let searchOptionsValues = utils.getDataFromMultifield(resourceResolver, "searchOptionsList", function(childResource) {
        let itemData = {};
        itemData.searchLabel = childResource.properties["searchLabel"];
        itemData.searchKey = childResource.properties["searchKey"];
        itemData.showIfIsHouseAccount = childResource.properties["showIfIsHouseAccount"];
        return itemData;
    });

    let dateOptionValues = utils.getDataFromMultifield(resourceResolver, "dateOptionsList", function(childResource) { 
        let itemData = {};
        itemData.label = childResource.properties["label"];
        itemData.field = childResource.properties["field"];
        return itemData;
    });

    if (dateOptionValues != null) {
        jsonObject["dateOptionValues"] = dateOptionValues;
    }

    if (searchOptionsValues != null) {
        jsonObject["searchOptionsList"] = searchOptionsValues;
    }
    jsonObject["uiServiceEndPoint"] = this.serviceData.uiServiceDomain + this.serviceData.renewalsGridEndpoint || '';

    if (this.agGridLicenseKey) {
        jsonObject["agGridLicenseKey"] = this.agGridLicenseKey;
    }
    if (properties && properties["itemsPerPage"]) {
        jsonObject["itemsPerPage"] = properties["itemsPerPage"];
    }
    if (properties && properties["shopPath"]) {
        jsonObject["shopURL"] = properties["shopPath"];
    }
    if (properties && properties["paginationStyle"]) {
        jsonObject["paginationStyle"] = properties["paginationStyle"];
    }
    if (properties && properties["defaultSortingColumnKey"]) {
        optionData.defaultSortingColumnKey = properties["defaultSortingColumnKey"];
    }
    if (properties && properties["defaultSortingDirection"]) {
        optionData.defaultSortingDirection = properties["defaultSortingDirection"];
    }

    if (optionData != null) {
        jsonObject["options"] = optionData;
    }

    if (properties && properties["filterTitle"]) {
        jsonObject["filterTitle"] = properties["filterTitle"];
    }

    if (properties && properties["clearAllFilterTitle"]) {
        jsonObject["clearAllFilterTitle"] = properties["clearAllFilterTitle"];
    }

    if (properties && properties["showResultLabel"]) {
        jsonObject["showResultLabel"] = properties["showResultLabel"];
    }

    if (properties && properties["menuCopy"]) {
        jsonObject["menuCopy"] = properties["menuCopy"];
    }

    if (properties && properties["menuCopyWithHeaders"]) {
        jsonObject["menuCopyWithHeaders"] = properties["menuCopyWithHeaders"];
    }

    if (properties && properties["menuExport"]) {
        jsonObject["menuExport"] = properties["menuExport"];
    }

    if (properties && properties["menuCsvExport"]) {
        jsonObject["menuCsvExport"] = properties["menuCsvExport"];
    }

    if (properties && properties["menuExcelExport"]) {
        jsonObject["menuExcelExport"] = properties["menuExcelExport"];
    }

    if (properties && properties["menuOpenLink"]) {
        jsonObject["menuOpenLink"] = properties["menuOpenLink"];
    }

    if (properties && properties["menuCopyLink"]) {
        jsonObject["menuCopyLink"] = properties["menuCopyLink"];
    }

    if (properties && properties["ofTextLabel"]) {
        jsonObject["ofTextLabel"] = properties["ofTextLabel"];
    }

    if (properties && properties["filterType"]) {
        jsonObject["filterType"] = properties["filterType"];
    }

    let node = resourceResolver.getResource(currentNode.getPath() + "/filterList");
    let filterListValues = [];
    if (node !== null) {
        let childrenList = node.getChildren();
        for (let [key, res] in Iterator(childrenList)) {
            let accordionLabel = res.properties["accordionLabel"];
            let filterField = res.properties["filterField"];
            let itemData = {};
            itemData.accordionLabel = accordionLabel;
            itemData.filterField = filterField;
            let childNode = resourceResolver.getResource(res.getPath() + '/filtersOptionsList');

            if (childNode != null) {
                itemData.filterOptionsValues = [];
                let childNodeList = childNode.getChildren();
                for (let [childkey, childRes] in Iterator(childNodeList)) {
                    let childDataItem = {};
                    let filterOptionLabel = childRes.properties["filterOptionLabel"];
                    childDataItem.filterOptionLabel = filterOptionLabel;
                    let subChildNode = resourceResolver.getResource(childRes.getPath() + '/subFilterOptionList');

                    if (subChildNode != null) {
                        let subFilterOptionsValues = [];
                        let subChildNodeList = subChildNode.getChildren();

                        for (let [subChildKey, subChildRes] in Iterator(subChildNodeList)) {
                            let subChildDataItem = {};
                            subChildDataItem.subFilterOptionsLabel = subChildRes.properties["subFilterOptionsLabel"];
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
        jsonObject['filterListValues'] = filterListValues;
    }

    if (properties && properties["quoteIdLabel"]) {
        productGrid["quoteIdLabel"] = properties["quoteIdLabel"];
    }
     if (properties && properties["quoteIdLabel"]) {
            productGrid["multipleLabel"] = properties["multipleLabel"];
        }
    if (properties && properties["refNoLabel"]) {
        productGrid["refNoLabel"] = properties["refNoLabel"];
    }

    if (properties && properties["expiryDateLabel"]) {
        productGrid["expiryDateLabel"] = properties["expiryDateLabel"];
    }

    if (properties && properties["quoteTextForFileName"]) {
        productGrid["quoteTextForFileName"] = properties["quoteTextForFileName"];
    }

    if (properties && properties["downloadPDFLabel"]) {
        productGrid["downloadPDFLabel"] = properties["downloadPDFLabel"];
    }

    if (properties && properties["downloadXLSLabel"]) {
        productGrid["downloadXLSLabel"] = properties["downloadXLSLabel"];
    }

    if (properties && properties["showDownloadPDFButton"]) {
        productGrid["showDownloadPDFButton"] = properties["showDownloadPDFButton"];
    }

    if (properties && properties["showDownloadXLSButton"]) {
        productGrid["showDownloadXLSButton"] = properties["showDownloadXLSButton"];
    }

    if (properties && properties["showDownloadXLSButton"]) {
        productGrid["showDownloadXLSButton"] = properties["showDownloadXLSButton"];
    }

    if (properties && properties["showSeeDetailsButton"]) {
        productGrid["showSeeDetailsButton"] = properties["showSeeDetailsButton"];
    }

    if (properties && properties["seeDetailsLabel"]) {
        productGrid["seeDetailsLabel"] = properties["seeDetailsLabel"];
    }

    if (productGrid != null) {
        jsonObject["productGrid"] = productGrid;
    }

    if (this.exportXLSRenewalsEndpoint != null && this.serviceData.uiServiceDomain) {
        jsonObject["exportXLSRenewalsEndpoint"] = this.serviceData.uiServiceDomain + this.exportXLSRenewalsEndpoint;
    }

    if (this.exportPDFRenewalsEndpoint != null && this.serviceData.uiServiceDomain) {
        jsonObject["exportPDFRenewalsEndpoint"] = this.serviceData.uiServiceDomain + this.exportPDFRenewalsEndpoint;
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
    
    if (this.renewalDetailsEndpoint && this.serviceData.uiServiceDomain) {
        jsonObject["renewalDetailsEndpoint"] = this.serviceData.uiServiceDomain + this.renewalDetailsEndpoint;
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

    const overdueProperties = {values: ['overdueIcon','overdueIconColor'], propertyName: 'overdueDaysRange'};   
    const thirtyDaysProperties = {values:['afterZeroIcon', 'afterZeroIconColor'], propertyName: 'afterZeroDaysRange'};
    const sixtyOneDaysProperties = {values : ['afterThirtyIcon', 'afterThirtyIconColor'], propertyName: 'afterThirtyDaysRange'};   
    const sixtyOnePlusProperties = {values : ['sixtyPlusIcon', 'sixtyPlusIconColor'], propertyName:'sixtyPlusDaysRange'};

    const orderingProperties = ["showOrderingIcon","placeOrderDialogTitle","termsAndConditions","termsAndConditionsLink","successSubmission","failedSubmission", "noResponseMessage"]

    function populateOutterProperty (obj, prop) {
        const populated = utils.fillFieldsDialogProperties(prop.values);       
        const daysPropertyName = properties[prop.propertyName]
        if (populated && daysPropertyName) {obj[daysPropertyName] = populated};
    }
    
    if (properties){     
        populateOutterProperty(icons,overdueProperties);
        populateOutterProperty(icons,thirtyDaysProperties);
        populateOutterProperty(icons,sixtyOneDaysProperties);
        populateOutterProperty(icons,sixtyOnePlusProperties);  
        const orderingFromDashboard = utils.fillFieldsDialogProperties(orderingProperties);
        if (!!orderingFromDashboard) {jsonObject['orderingFromDashboard'] = orderingFromDashboard};
    }

    if (!!icons) {jsonObject['icons'] = icons};

    if (properties && properties["hideCopyHeaderOption"]) {
        jsonObject["hideCopyHeaderOption"] = properties["hideCopyHeaderOption"];
    }

    if (properties && properties["hideExportOption"]) {
        jsonObject["hideExportOption"] = properties["hideExportOption"];
    }

    if (properties && properties["noResultsTitle"]) {
        noResultsValues.noResultsTitle = properties["noResultsTitle"];
    }

    if (properties && properties["noResultsDescription"]) {
        noResultsValues.noResultsDescription = properties["noResultsDescription"];
    }

    if (properties && properties["noResultsImageFileReference"]) {
        noResultsValues.noResultsImage = properties["noResultsImageFileReference"];
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

    if (properties && properties["shareFlyoutQuoteDescription"]) {
        shareFlyout.shareFlyoutQuoteDescription = properties["shareFlyoutQuoteDescription"];
    }

    if (properties && properties["shareFlyoutButtonLabel"]) {
        shareFlyout.shareFlyoutButtonLabel = properties["shareFlyoutButtonLabel"];
    }

    if (noResultsValues != null) {
        jsonObject["searchResultsError"] = noResultsValues;
    }

    if (copyFlyout != null) {
        jsonObject["copyFlyout"] = copyFlyout;
    }

    if (shareFlyout != null) {
        jsonObject["shareFlyout"] = shareFlyout;
    }

    return {
        configJson: JSON.stringify(jsonObject)
    };
});