import React from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

export const VendorPartNoDetails = ({ quote, labels, currentlyTypedWord }) => {
  const { productId, manufacturerPartNumber, globalManufacturer, shortDescription } = quote;
  const isNumeric = (str) => {
    return /^[0-9]+$/.test(str);
  };

  const isVendorNumFlag = isNumeric(currentlyTypedWord);

  const VendorPartNumberWithHighlight = () => {
    if (!currentlyTypedWord) {
      return productId;
    }

    let string = productId.substr(
      0,
      productId.toLowerCase().indexOf(currentlyTypedWord.toLowerCase())
    );
    let endString = productId.substr(
      productId.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()) +
        currentlyTypedWord.length
    );
    let highlightedText = productId.substr(
      productId.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()),
      currentlyTypedWord.length
    );
    return isVendorNumFlag ? (
      <>
        <span>{string}</span>
        <span className="cmp-flyout__content-search__quote--highlighted">
          {highlightedText}
        </span>
        <span>{endString}</span>
      </>
    ) : (
      productId
    );
  };

  const VendorPartNameWithHighlight = () => {
    if (!currentlyTypedWord) {
      return manufacturerPartNumber;
    }

    let string = manufacturerPartNumber.substr(
      0,
      manufacturerPartNumber
        .toLowerCase()
        .indexOf(currentlyTypedWord.toLowerCase())
    );
    let endString = manufacturerPartNumber.substr(
      manufacturerPartNumber
        .toLowerCase()
        .indexOf(currentlyTypedWord.toLowerCase()) + currentlyTypedWord.length
    );
    let highlightedText = manufacturerPartNumber.substr(
      manufacturerPartNumber
        .toLowerCase()
        .indexOf(currentlyTypedWord.toLowerCase()),
      currentlyTypedWord.length
    );
    return !isVendorNumFlag ? (
      <>
        <span>{string}</span>
        <span className="cmp-flyout__content-search__quote--highlighted">
          {highlightedText}
        </span>
        <span>{endString}</span>
      </>
    ) : (
      manufacturerPartNumber
    );
  };

  const VendorPartShortDescriptionWithHighlight = () => {
    let string = shortDescription.substr(
      0,
      shortDescription.toLowerCase().indexOf(currentlyTypedWord.toLowerCase())
    );
    let endString = shortDescription.substr(
      shortDescription.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()) +
        currentlyTypedWord.length
    );
    let highlightedText = shortDescription.substr(
      shortDescription.toLowerCase().indexOf(currentlyTypedWord.toLowerCase()),
      currentlyTypedWord.length
    );
    return isVendorNumFlag ? (
      shortDescription) : (
      shortDescription
    );
  };

  return (
    <div className="cmp-flyout__quotecmp-flyout__selected-quote ">
      {productId && (
        <>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__label-header">
            {labels &&
              getDictionaryValueOrKey(
                labels.selectedAccountLabel || 'Selected account'
              )}
          </div>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__account-manufacturerPartNumber">
            {labels && (
              <span className="cmp-flyout__quotecmp-flyout__selected-quote__label">
                {getDictionaryValueOrKey(
                  labels.accountNameLabel || 'Product manufacturerPartNumber:'
                )}
              </span>
            )}
            <VendorPartNameWithHighlight />
          </div>
          <div className="cmp-flyout__quotecmp-flyout__selected-quote__short-description">
            {labels && (
              <span className="cmp-flyout__quotecmp-flyout__selected-quote__label">
                {getDictionaryValueOrKey(
                  labels.accountShortDescription || 'Short Description:'
                )}
              </span>
            )}
            <VendorPartShortDescriptionWithHighlight />
          </div>
          
        </>
      )}
    </div>
  );
};
