import React, { useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Counter from '../../Counter/Counter';

const NewlyAddedLineItem = ({ item = {}, index, onChange, labels }) => {
  return (
    <li key={item.line} className="cmp-flyout-list__element newly-added">
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
      <div className="cmp-flyout-list__element__counter">
        <Counter minVal={0} value={1} onChange={() => {}} />
      </div>
      <div className="cmp-flyout-list__element__price">
        <p className="cmp-flyout-list__element__price-bold">
          {getDictionaryValueOrKey(labels.lineTotal)} ({item.currency})
        </p>
        <p>{(1 * item.unitPrice).toFixed(2)}</p>
      </div>
    </li>
  );
};

export default NewlyAddedLineItem;
