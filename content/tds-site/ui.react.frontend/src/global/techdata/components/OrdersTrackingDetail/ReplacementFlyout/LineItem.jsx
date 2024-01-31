import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const LineItem = ({ data, labels = {}, toBeReplacedItem = false }) => {
  const item = data?.line;
  const {
    line,
    urlProductImage,
    displayName,
    mfrNumber,
    originalOrderQuantity,
    unitPrice,
    unitPriceFormatted,
    currency,
  } = item || {};
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
            labels?.lineMfgPartNo
          )} ${mfrNumber}`}</div>
        </div>
        <div className="cmp-flyout-list__element__quantity">
          <p className="bold">{getDictionaryValueOrKey(labels.qty)}:</p>
          <p>{originalOrderQuantity}</p>
        </div>
        <div className="cmp-flyout-list__element__unit-cost">
          <p className="bold">
            {getDictionaryValueOrKey(labels.unitCost)} ({currency})
          </p>
          <p>{unitPriceFormatted}</p>
        </div>
        <div className="cmp-flyout-list__element__line-total">
          <p className="bold">
            {getDictionaryValueOrKey(labels.lineTotal)} ({currency})
          </p>
          <p>{Number(unitPrice) * Number(originalOrderQuantity)}</p>
        </div>
      </div>
    </div>
  );
};

export default LineItem;
