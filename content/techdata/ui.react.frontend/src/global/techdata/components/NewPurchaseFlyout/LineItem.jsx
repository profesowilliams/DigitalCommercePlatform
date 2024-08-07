import React, { useEffect, useState } from 'react';
import QuantityColumn from './QuantityColumn.jsx';
import {
  ArrowResetIcon,
  TrashcanIcon,
} from '../../../../fluentIcons/FluentIcons';

const LineItem = ({
  item,
  data,
  setItems,
  handleAddProductToGrid,
  setPlaceOrderActive,
}) => {
  // Initialize the state with the unit price as a string
  const [quantity, setQuantity] = useState(parseInt(item?.quantity) || '1');
  const [unitPrice, setUnitPrice] = useState(item?.unitPrice || '0');
  const [totalPrice, setTotalPrice] = useState(() =>
    (quantity * parseFloat(unitPrice)).toFixed(2)
  );
  const itemProduct = item?.product.find(
    (product) => product?.type === 'MANUFACTURER'
  );
  const canEditResellerPrice = data?.reseller?.vendorAccountNumber?.canEdit;

  const updateItem = (itemId, changes) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        const itemProduct = item?.product.find(
          (product) => product?.type === 'MANUFACTURER'
        );
        if (itemProduct?.id === itemId) {
          return { ...item, ...changes };
        }
        return item;
      });
      return updated;
    });
  };

  const handleChange = (event, itemId) => {
    let value = event.target.value;
    value = parseFloat(value).toFixed(2);
    setUnitPrice(value);
    const changes = {
      quantity: quantity.toString(),
      unitPrice: value,
      totalPrice: (quantity * parseFloat(value)).toFixed(2),
    };
    updateItem(itemId, changes);
    setPlaceOrderActive(false);
  };

  const handleQuantityChange = (newQuantity) => {
    const integerQuantity = parseInt(newQuantity);
    setQuantity(integerQuantity);
    const changes = {
      quantity: integerQuantity.toString(),
      unitPrice: unitPrice,
      totalPrice: (integerQuantity * parseFloat(unitPrice)).toFixed(2),
    };
    updateItem(itemProduct?.id, changes);
    setPlaceOrderActive(false);
  };

  const handleResetPrice = () => {
    const originalPrice = parseFloat(item?.unitPrice).toFixed(2);
    setUnitPrice(originalPrice);
    const changes = {
      quantity: quantity.toString(),
      unitPrice: originalPrice,
      totalPrice: (quantity * parseFloat(originalPrice)).toFixed(2),
    };
    updateItem(itemProduct?.id, changes);
    setPlaceOrderActive(false);
  };

  const handleDeleteLine = () => {
    setItems((prevItems) =>
      prevItems.filter((i) => {
        const product = i.product.find((p) => p.type === 'MANUFACTURER');
        return product.id !== itemProduct?.id;
      })
    );
    handleAddProductToGrid();
    setPlaceOrderActive(false);
  };

  useEffect(() => {
    setTotalPrice((quantity * parseFloat(unitPrice)).toFixed(2));
  }, [quantity, unitPrice]);

  return (
    <tr>
      <td className="cmp-flyout-newPurchase__form-table__body__text">
        <div className="body-content-column">
          <span>{itemProduct?.family}</span>
          <span>{itemProduct?.name}</span>
        </div>
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text">
        {itemProduct?.id}
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text text-align-end">
        {item?.unitListPrice}
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text text-align-end">
        {canEditResellerPrice ? (
          <div className="cmp-flyout-newPurchase__form-table__body__input">
            <input
              type="number"
              name="unitPrice"
              value={unitPrice}
              onChange={(e) => handleChange(e, itemProduct?.id)}
            />
            <button onClick={handleResetPrice}>
              <ArrowResetIcon />
            </button>
          </div>
        ) : (
          <div>{item?.unitPrice}</div>
        )}
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text text-align-center">
        <div>
          <QuantityColumn
            item={item}
            value={quantity}
            setValue={handleQuantityChange}
          />
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
