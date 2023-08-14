import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Counter from '../../Counter/Counter';
import { InfoIcon } from './../../../../../fluentIcons/FluentIcons';

const LineItem = ({
  item,
  index,
  onChange,
  labels,
  setQuantityDifference,
  setProductID,
}) => {
  const [quantityIncreased, setQuantityIncreased] = useState(false);
  const [currentValue, setCurrentValue] = useState(item.quantity);

  const calculatedValue = currentValue - item?.quantity;
  const handleAmountChange = (newValue) => {
    setQuantityIncreased(Boolean(newValue > item.quantity));
    setCurrentValue(newValue);
    onChange(index, newValue);
    setProductID(item?.tdNumber);
  };
  useEffect(() => {
    setQuantityDifference(calculatedValue);
  }, [currentValue]);

  useEffect(() => {
    setQuantityDifference(calculatedValue);
  }, [currentValue]);

  return (
    <li key={item.id} className="cmp-flyout-list__element">
      <div className="cmp-flyout-list__element__number">{item.id}</div>
      <div className="cmp-flyout-list__element__picture">
        <img src={item?.urlProductImage} alt="" />
      </div>
      <div className="cmp-flyout-list__element__title">
        <p>{item.displayName}</p>
        <div>{`${getDictionaryValueOrKey(labels?.lineMfgPartNo)} ${
          item.manufacturerPart
        }`}</div>
      </div>
      <div className="cmp-flyout-list__element__counter">
        <Counter value={currentValue} onChange={handleAmountChange} />
        {quantityIncreased && (
          <p>
            <InfoIcon />
            {getDictionaryValueOrKey(labels.additionalQuantityAdded)}
          </p>
        )}
      </div>
      <div className="cmp-flyout-list__element__price">
        <p className="cmp-flyout-list__element__price-bold">
          {getDictionaryValueOrKey(labels.lineTotal)} ({item.unitPriceCurrency})
        </p>
        <p> {item.unitPriceFormatted}</p>
      </div>
    </li>
  );
};

export default LineItem;
