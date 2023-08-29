import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Counter from '../../Counter/Counter';
import { InfoIcon } from './../../../../../fluentIcons/FluentIcons';
import DecreasedReasonDropdown from './DecreasedReasonDropdown';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';

const LineItem = ({
  item,
  index,
  onChange,
  labels,
  setQuantityDifference,
  setProductID,
}) => {
  const [quantityIncreased, setQuantityIncreased] = useState(false);
  const [currentValue, setCurrentValue] = useState(item.orderQuantity);
  const [decreasedReason, setDecreasedReason] = useState('');
  const [quantityDecreased, setQuantityDecreased] = useState(false);
  const { setReasonDropdownValues, setDoesReasonDropdownHaveEmptyItems } =
    useOrderTrackingStore((st) => st.effects);
  const reasonDropdownValues = useOrderTrackingStore(
    (st) => st.reasonDropdownValues
  );

  const calculatedValue = currentValue - item?.orderQuantity;
  const handleAmountChange = (newValue) => {
    setQuantityIncreased(Boolean(newValue > item.orderQuantity));
    setQuantityDecreased(Boolean(newValue < item.orderQuantity));
    setCurrentValue(newValue);
    onChange(index, newValue);
    setProductID(item?.tdNumber);
    if (currentValue >= item.orderQuantity) {
      setDoesReasonDropdownHaveEmptyItems(false);
    }
  };
  useEffect(() => {
    setQuantityDifference(calculatedValue);
  }, [currentValue]);

  const handleChangeReason = (val) => {
    const newArray = reasonDropdownValues;
    newArray[index] = val;
    setDoesReasonDropdownHaveEmptyItems(
      newArray.some((dropdown) => dropdown === '') &&
        currentValue < item.orderQuantity
    );
    setReasonDropdownValues(newArray);
    setDecreasedReason(val);
  };

  return (
    <li key={item.line} className="cmp-flyout-list__element">
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
        <Counter
          minVal={0}
          value={currentValue}
          onChange={handleAmountChange}
        />
        {quantityIncreased && (
          <div className="full-width">
            <p>
              <InfoIcon />
              {getDictionaryValueOrKey(labels.additionalQuantityAdded)}
            </p>
          </div>
        )}
        {quantityDecreased && (
          <DecreasedReasonDropdown
            labels={labels}
            decreasedReason={decreasedReason}
            handleChangeReason={handleChangeReason}
          />
        )}
      </div>
      <div className="cmp-flyout-list__element__price">
        <p className="cmp-flyout-list__element__price-bold">
          {getDictionaryValueOrKey(labels.lineTotal)} ({item.unitPriceCurrency})
        </p>
        <p>{(currentValue * item.unitPrice).toFixed(2)}</p>
      </div>
    </li>
  );
};

export default LineItem;
