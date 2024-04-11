import React, { useEffect, useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import Counter from '../../Counter/Counter';
import { usPost } from '../../../../../utils/api';

const NewlyAddedLineItem = ({
  item = {},
  index,
  onChange,
  removeElement,
  labels,
  domain,
}) => {
  const [price, setPrice] = useState(null);
  const [currency, setCurrency] = useState('');
  const [quantity, setQuantity] = useState(item.quantity);

  const handleAmountChange = (newValue) => {
    setQuantity(newValue);
  };

  useEffect(async () => {
    try {
      const result = await usPost(`${domain}/v2/Price/GetPriceForProduct`, {
        productId: item.id,
        quantity: quantity,
      });
      const { price, currency } = result?.data?.content?.priceData || {};
      setCurrency(currency);
      setPrice(price);
      onChange(index, quantity, price);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [quantity]);

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
          value={Number(item.quantity)}
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
          {getDictionaryValueOrKey(labels.lineTotal)} ({currency}){' '}
        </p>
        {price && <p>{(item.quantity * price).toFixed(2)}</p>}
      </div>
    </li>
  );
};

export default NewlyAddedLineItem;
