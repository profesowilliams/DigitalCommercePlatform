export const isDealSelectorHidden = (quoteDetails) => isVendorQuote(quoteDetails.source)

export const isQuickQuoteButtonDisabled = (quoteDetails, didQuantitiesChange) => {
    return isVendorQuote(quoteDetails.source)
        || (isEstimate(quoteDetails.source) && (!!quoteDetails.spaId || didQuantitiesChange));
}

export const isVendorQuote = (source) => source.type === 'VendorQuote'
export const isEstimate = (source) => source.type === 'Estimate'