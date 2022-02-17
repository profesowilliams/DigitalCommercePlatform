import { QUOTE_PREVIEW_AVT_TECHNOLOGY, QUOTE_PREVIEW_AVT_TECHNOLOGY_CUSTOMER_METHOD, QUOTE_PREVIEW_TECH_DATA, QUOTE_PREVIEW_TECH_DATA_AND_AVT_VALUE, QUOTE_PREVIEW_TECH_DATA_CUSTOMER_METHOD } from "../../../../utils/constants";

export const isDealSelectorHidden = (quoteDetails) => isDealConfiguration(quoteDetails.source);

export const isQuickQuoteButtonDisabled = (quoteDetails, didQuantitiesChange) => {
    return isVendorQuote(quoteDetails.source)
        || (isEstimate(quoteDetails.source) && (!!quoteDetails.spaId || didQuantitiesChange));
}

export const isVendorQuote = (source) => source.type === 'VendorQuote'

export const isDealConfiguration = (source) => source.type === 'Deal'

export const isTechDataDistiBuy = (distiBuyMethod) => distiBuyMethod?.toUpperCase() === QUOTE_PREVIEW_TECH_DATA.toUpperCase();

export const isAVTTechDistiBuy = (distiBuyMethod) => distiBuyMethod?.toUpperCase() === QUOTE_PREVIEW_AVT_TECHNOLOGY.toUpperCase();

export const isTechDataCustomerMethod = (customerMethod) => customerMethod?.toUpperCase() === QUOTE_PREVIEW_TECH_DATA_CUSTOMER_METHOD.toUpperCase() || QUOTE_PREVIEW_TECH_DATA_AND_AVT_VALUE.toUpperCase();

export const isAVTTechCustomerMethod = (customerMethod) => customerMethod?.toUpperCase() === QUOTE_PREVIEW_AVT_TECHNOLOGY_CUSTOMER_METHOD.toUpperCase() || QUOTE_PREVIEW_TECH_DATA_AND_AVT_VALUE.toUpperCase();

export const isEstimate = (source) => source.type === 'Estimate'

export const isPricingOptionsRequired = (quoteDetails, quoteWithoutPricing) => quoteWithoutPricing && !quoteDetails.tier

export const isAllowedQuantityIncrease = (quoteDetails) => isEstimate(quoteDetails.source)

export const isAllowedEndUserUpdate = (quoteDetails) => isEstimate(quoteDetails.source)

export const isDealRequired = (quoteDetails, quoteWithoutDeal) => !isDealConfiguration(quoteDetails.source) && quoteWithoutDeal && isEstimate(quoteDetails.source) && !quoteDetails.spaId

export const validateRequiredEnduserFields = (enduser) => {
    // This logic may be needed to validate specific scenarios in the future however
    // Only end user name is required for now
    // Removing line2 from this validation since is an optional Value.
    //if (enduser?.line2 === '' || enduser?.line2 === null) {
    //    delete enduser.line2;
    //}
    // Removing id from this validation since is returning null
    //if (enduser?.id === '' || enduser?.id === null) {
    //    delete enduser.id;
    //}
    // return Object.values(enduser).some(value => value === null || value === '');
    return enduser?.companyName === null || enduser?.companyName === '';

}

export const isEndUserMissing = (quoteDetails, quoteWithoutEndUser) => {
    const endUser = quoteDetails.endUser && quoteDetails.endUser[0] ? quoteDetails.endUser[0] : quoteDetails.endUser;
    return quoteWithoutEndUser && (!endUser || validateRequiredEnduserFields(endUser));
}
