import React, { useEffect, useState } from 'react';
import QuantityColumn from './QuantityColumn.jsx';
import {
  ArrowResetIcon,
  TrashcanIcon,
} from '../../../../fluentIcons/FluentIcons';

const LineItem = ({ item, index, internalUser, setSubtotalValue }) => {
  // Initialize the state with the unit price as a string
  const [quantity, setQuantity] = useState('1');
  const [unitPrices, setUnitPrices] = useState([item?.unitPrice]);
  const [totalPrice, setTotalPrice] = useState(quantity * unitPrices);

  //   const isEditable = internalUser;
  const isEditable = false;

  const handleInputChange = (index, newValue) => {
    const newUnitPrices = [...unitPrices];
    newUnitPrices[index] = newValue;
    setUnitPrices(newUnitPrices);
  };

  const handleResetPrice = (index) => {
    const originalPrice = item?.unitPrice;
    handleInputChange(index, originalPrice);
  };

  const handleDeleteLine = () => {
    console.log('Line has been deleted');
  };

  useEffect(() => {
    setTotalPrice(quantity * unitPrices);
  }, [quantity, unitPrices]);
  return (
    <tr>
      <td className="cmp-flyout-newPurchase__form-table__body__text">
        <div className="body-content-column">
          <span>{item?.productFamily}</span>
          <span>{item?.productDescription}</span>
        </div>
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text">
        {item?.vendorPartNo}
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text text-align-end">
        {item?.listPrice}
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text text-align-end">
        {isEditable ? (
          <div className="cmp-flyout-newPurchase__form-table__body__input">
            <input
              type="number"
              value={unitPrices[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            <button onClick={() => handleResetPrice(index)}>
              <ArrowResetIcon />
            </button>
          </div>
        ) : (
          <div>{item?.unitPrice}</div>
        )}
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text text-align-center">
        <div>
          <QuantityColumn data={item} value={quantity} setValue={setQuantity} />
        </div>
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text text-align-end">
        <div className="total-price-body">
          <span>{totalPrice}</span>
          <button onClick={handleDeleteLine}>
            <TrashcanIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LineItem;
