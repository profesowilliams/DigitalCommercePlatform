import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

const LineItem = ({ item, labels = {}, toBeReplacedItem = false }) => {
  return (
    <div
      className={`cmp-flyout-list ${toBeReplacedItem ? 'to-be-replaced' : ''} `}
    >
      <div key={item.line} className="cmp-flyout-list__element replacement">
        <div className="cmp-flyout-list__element__number">{item.line}</div>
        <div className="cmp-flyout-list__element__picture">
          <img src={item?.urlProductImage} alt="" />
        </div>
        <div className="cmp-flyout-list__element__title">
          <p>{item.displayName}</p>
          <div>{`${getDictionaryValueOrKey(labels?.lineMfgPartNo)} ${
            item.mfrNumber
          }`}</div>
        </div>
        <div className="cmp-flyout-list__element__quantity">
          <p className="bold">{getDictionaryValueOrKey(labels.quantity)}:</p>
          <p>{item.orderQuantity}</p>
        </div>
        <div className="cmp-flyout-list__element__unit-cost">
          <p className="bold">
            {getDictionaryValueOrKey(labels.unitCost)} ({item.unitPriceCurrency}
            )
          </p>
          <p>{item.unitPriceFormatted}</p>
        </div>
        <div className="cmp-flyout-list__element__line-total">
          <p className="bold">
            {getDictionaryValueOrKey(labels.lineTotal)} (
            {item.unitPriceCurrency})
          </p>
          <p>{item.totalPriceFormatted}</p>
        </div>
      </div>
    </div>
  );
};

export default LineItem;
