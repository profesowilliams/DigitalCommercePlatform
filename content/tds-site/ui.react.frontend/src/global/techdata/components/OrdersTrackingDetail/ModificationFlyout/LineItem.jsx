import React, { useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Counter from '../../Counter/Counter';
import { InfoIcon } from './../../../../../fluentIcons/FluentIcons';
import RejectedReasonDropdown from './RejectedReasonDropdown';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';
import { usGet } from '../../../../../utils/api';

const LineItem = ({ item, index, onChange, labels, domain }) => {
  const [quantityIncreased, setQuantityIncreased] = useState(false);
  const [quantityDecreased, setQuantityDecreased] = useState(false);
  const [currentValue, setCurrentValue] = useState(item.orderQuantity);
  const [rejectedReason, setRejectedReason] = useState('');
  const [totalPriceFormatted, setTotalPriceFormatted] = useState(
    item?.totalPriceFormatted || ''
  );

  const { setReasonDropdownValues, setDoesReasonDropdownHaveEmptyItems } =
    useOrderTrackingStore((st) => st.effects);
  const reasonDropdownValues = useOrderTrackingStore(
    (st) => st.orderModification.reasonDropdownValues
  );

  const fetchNewPrice = async (amount) => {
    try {
      const result = await usGet(`${domain}/v3/format/currency/${amount}`);
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAmountChange = async (newValue) => {
    const newPrice = await fetchNewPrice(
      (newValue * item.unitPrice).toFixed(2)
    );
    setTotalPriceFormatted(newPrice.data);
    const formattedNewValue = Number(newValue);
    setQuantityIncreased(Boolean(formattedNewValue > item.orderQuantity));
    setQuantityDecreased(Boolean(formattedNewValue < item.orderQuantity));
    setCurrentValue(newValue);
    onChange(index, {
      ...item,
      orderQuantity: formattedNewValue,
      origQuantity: item.orderQuantity,
    });
    if (formattedNewValue > 0) {
      setDoesReasonDropdownHaveEmptyItems(false);
    }
    if (newValue === '') {
      setDoesReasonDropdownHaveEmptyItems(true);
    }
  };

  const handleOnBlur = (newValue) => {
    if (newValue === '') {
      setCurrentValue(Number(newValue));
      setDoesReasonDropdownHaveEmptyItems(true);
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
          onBlur={handleOnBlur}
        />
        {quantityIncreased && (
          <p>
            <InfoIcon />
            {getDictionaryValueOrKey(labels?.additionalQuantityAdded)}
          </p>
        )}
        {quantityDecreased && currentValue === 0 && (
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
        <p>{totalPriceFormatted}</p>
      </div>
    </li>
  );
};

export default LineItem;
