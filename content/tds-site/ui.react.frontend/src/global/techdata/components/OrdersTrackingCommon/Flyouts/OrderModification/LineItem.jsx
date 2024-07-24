import React, { useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../../../utils/utils';
import Counter from './Counter';
import { InfoIcon } from '../../../../../../fluentIcons/FluentIcons';
import RejectedReasonDropdown from './RejectedReasonDropdown';
import { useOrderTrackingStore } from '../../Store/OrderTrackingStore';
import Tooltip from '@mui/material/Tooltip';
import { usGet } from '../../../../../../utils/api';

const LineItem = ({ item, index, onChange, labels, domain, enableAddLine }) => {
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
    const numeralValue = Number(newValue);
    const newPrice = await fetchNewPrice(
      (numeralValue * item.unitPrice).toFixed(2)
    );
    setTotalPriceFormatted(newPrice.data);
    setQuantityIncreased(Boolean(numeralValue > item.orderQuantity));
    setQuantityDecreased(Boolean(numeralValue < item.orderQuantity));
    const displayedValue = newValue === '' ? newValue : numeralValue;
    setCurrentValue(displayedValue);
    onChange(index, {
      ...item,
      orderQuantity: displayedValue,
      origQuantity: item.orderQuantity,
    });
    if (numeralValue > 0) {
      setDoesReasonDropdownHaveEmptyItems(false);
    }
    if (newValue === '') {
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
          enableAddLine={enableAddLine}
          originalQuantity={item.orderQuantity}
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
