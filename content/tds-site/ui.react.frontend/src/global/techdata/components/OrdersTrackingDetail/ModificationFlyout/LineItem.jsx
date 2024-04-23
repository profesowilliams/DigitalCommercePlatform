import React, { useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Counter from '../../Counter/Counter';
import { InfoIcon } from './../../../../../fluentIcons/FluentIcons';
import RejectedReasonDropdown from './RejectedReasonDropdown';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';

const formatToCurrency = (number) =>
  number
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&.')
    .replace(/.([^.]*)$/, ',' + '$1');

const LineItem = ({ item, index, onChange, labels }) => {
  const [quantityIncreased, setQuantityIncreased] = useState(false);
  const [quantityDecreased, setQuantityDecreased] = useState(false);
  const [currentValue, setCurrentValue] = useState(item.orderQuantity);
  const [rejectedReason, setRejectedReason] = useState('');

  const { setReasonDropdownValues, setDoesReasonDropdownHaveEmptyItems } =
    useOrderTrackingStore((st) => st.effects);
  const reasonDropdownValues = useOrderTrackingStore(
    (st) => st.orderModification.reasonDropdownValues
  );

  const handleAmountChange = (newValue) => {
    setQuantityIncreased(Boolean(newValue > item.orderQuantity));
    setQuantityDecreased(Boolean(newValue < item.orderQuantity));
    setCurrentValue(newValue);
    onChange(index, {
      ...item,
      orderQuantity: newValue,
      origQuantity: item.orderQuantity,
    });
    if (newValue >= item.orderQuantity) {
      setDoesReasonDropdownHaveEmptyItems(false);
    }
  };

  const handleChangeReason = (val) => {
    const newArray = reasonDropdownValues;
    newArray[index] = val;
    setDoesReasonDropdownHaveEmptyItems(
      newArray.some((dropdown) => dropdown === '') &&
        currentValue < item.orderQuantity
    );
    setReasonDropdownValues(newArray);
    setRejectedReason(val);
    onChange(index, {
      ...item,
      orderQuantity: currentValue,
      origQuantity: item.orderQuantity,
      status: 'Rejected',
      RejectionReason: val,
    });
  };
  return (
    <li key={item.line} className="cmp-flyout-list__element">
      <div className="cmp-flyout-list__element__number">{item.line}</div>
      <div className="cmp-flyout-list__element__picture">
        <img src={item?.urlProductImage} alt="" />
      </div>
      <div className="cmp-flyout-list__element__title">
        <Tooltip
          title={item.displayName}
          placement="top"
          arrow
          disableInteractive={true}
          disableHoverListener={item.displayName.length < 74}
        >
          <p>{item.displayName}</p>
        </Tooltip>

        <div className="cmp-flyout-list__element__title__mfr-number">{`${getDictionaryValueOrKey(
          labels?.lineMfgPartNo
        )} ${item.mfrNumber}`}</div>
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
              {getDictionaryValueOrKey(labels?.additionalQuantityAdded)}
            </p>
          </div>
        )}
        {quantityDecreased && (
          <RejectedReasonDropdown
            labels={labels}
            rejectedReason={rejectedReason}
            handleChangeReason={handleChangeReason}
          />
        )}
      </div>
      <div className="cmp-flyout-list__element__price">
        <p className="cmp-flyout-list__element__price-bold">
          {getDictionaryValueOrKey(labels.lineTotal)} ({item.currency})
        </p>
        <p>{formatToCurrency(currentValue * item.unitPrice)}</p>
      </div>
    </li>
  );
};

export default LineItem;
