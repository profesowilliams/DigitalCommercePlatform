import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Counter from '../../Counter/Counter';

const NewlyAddedLineItem = ({
  item = {},
  index,
  onChange,
  removeElement,
  labels,
}) => {
  const handleAmountChange = (newValue) => {
    onChange(index, newValue);
  };

  return (
    <li key={index} className="cmp-flyout-list__element newly-added">
      <div className="cmp-flyout-list__element__picture">
        <img src={item.imageUrl} alt="" />
      </div>
      <div className="cmp-flyout-list__element__title">
        <p>{item.description}</p>
        <div>{`${getDictionaryValueOrKey(labels?.lineMfgPartNo)} ${
          item.manufacturerPartNumber
        }`}</div>
      </div>
      <div className="cmp-flyout-list__element__counter">
        <Counter
          minVal={0}
          value={item.quantity}
          onChange={handleAmountChange}
        />
        <a
          className="cmp-flyout-list__element__counter__remove-link"
          onClick={removeElement}
        >
          {getDictionaryValueOrKey(labels?.newItemRemove)}
        </a>
      </div>
      <div className="cmp-flyout-list__element__price">
        <p className="cmp-flyout-list__element__price-bold">
          {getDictionaryValueOrKey(labels.lineTotal)} ({item.currency}){' '}
        </p>
        <p>{(item.quantity * item.price).toFixed(2)}</p>
      </div>
    </li>
  );
};

export default NewlyAddedLineItem;
