import React from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

const LineItem = ({ data, labels = {}, toBeReplacedItem = false }) => {
  const item = data?.line;
  const lineIndex = data?.index || 0;
  const {
    line,
    urlProductImage,
    displayName,
    mfrNumber,
    originalOrderQuantity,
    unitPriceFormatted,
    currency,
    lineDetails,
    totalFormatted,
  } = item || {};
  const replaceTotalQuantity = totalFormatted;
  return (
    <div
      className={`cmp-flyout-list ${toBeReplacedItem ? 'to-be-replaced' : ''} `}
    >
      <div key={line} className="cmp-flyout-list__element replacement">
        <div className="cmp-flyout-list__element__number">{line}</div>
        <div className="cmp-flyout-list__element__picture">
          <img src={urlProductImage} alt="" />
        </div>
        <div className="cmp-flyout-list__element__title">
          <p>{displayName}</p>
          <div>{`${getDictionaryValueOrKey(
            labels?.lineMfgPartNo || labels?.lineMfgPartNoReplacement
          )} ${mfrNumber}`}</div>
        </div>
        <div className="cmp-flyout-list__element__quantity">
          <p className="bold">
            {getDictionaryValueOrKey(labels?.qty || labels?.qtyReplacement)}:
          </p>
          <p>{lineDetails[lineIndex]?.quantity ?? originalOrderQuantity}</p>
        </div>
        <div className="cmp-flyout-list__element__unit-cost">
          <p className="bold">
            {getDictionaryValueOrKey(labels?.unitCost)} ({currency})
          </p>
          <p>{unitPriceFormatted}</p>
        </div>
        <div className="cmp-flyout-list__element__line-total">
          <p className="bold">
            {getDictionaryValueOrKey(
              labels?.lineTotal || labels?.lineTotalReplacement
            )}{' '}
            ({currency})
          </p>
          <p>
            {!toBeReplacedItem
              ? replaceTotalQuantity
              : lineDetails[lineIndex]?.subtotalPriceFormatted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LineItem;
