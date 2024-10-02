import React, { useEffect, useState } from 'react';
import QuantityColumn from './QuantityColumn.jsx';
import { thousandSeparator } from "../../helpers/formatting";
import {
  ArrowResetIcon,
  TrashcanIcon,
} from '../../../../fluentIcons/FluentIcons';

const LineItem = ({
  item,
  data,
  setItems,
  setPlaceOrderActive,
  setPayloadWithoutNewItem,
  setBannerOpen,
}) => {
  // Initialize the state with the unit price as a string
  const initialQuantity = parseInt(item?.quantity) || 1;
  const initialPriceFormatted = parseFloat(item?.unitPrice).toFixed(0);
  const originalPrice = parseFloat(item?.unitPriceOriginal).toFixed(0);
  const [quantity, setQuantity] = useState(parseInt(initialQuantity));
  const [unitPrice, setUnitPrice] = useState(initialPriceFormatted || '0');
  const [totalPrice, setTotalPrice] = useState(
    (quantity * parseFloat(unitPrice)).toFixed(0)
  );
  const [enableResetPrice, setEnableResetPrice] = useState(false);
  const itemProduct = item?.product.find(
    (product) => product?.type === 'MANUFACTURER'
  );
  const canEditResellerPrice = data?.canEditReselerPrice;

  const updateItem = (itemId, changes) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item?.id === itemId) {
          return { ...item, ...changes };
        }
        return item;
      });
      return updated;
    });
  };

  const handleChange = (event, itemId) => {
    const value = parseFloat(event.target.value).toFixed(0);
    const isOverride = value !== originalPrice;
    setUnitPrice(value);
    const newTotalPrice = (quantity * parseFloat(value)).toFixed(0);
    setTotalPrice(newTotalPrice);
    const changes = {
      quantity: quantity.toString(),
      unitPrice: value,
      totalPrice: newTotalPrice,
      isResellerPriceOverride: isOverride,
    };
    updateItem(itemId, changes);
    setPlaceOrderActive(false);
    setBannerOpen(false);
  };

  const handleQuantityChange = (newQuantity) => {
    const integerQuantity = parseInt(newQuantity);
    const isOverride = unitPrice !== originalPrice;
    setQuantity(integerQuantity);
    const newTotalPrice = (integerQuantity * parseFloat(unitPrice)).toFixed(0);
    setTotalPrice(newTotalPrice);
    const changes = {
      quantity: integerQuantity.toString(),
      unitPrice: unitPrice,
      totalPrice: (integerQuantity * parseFloat(unitPrice)).toFixed(0),
      isResellerPriceOverride: isOverride,
    };
    updateItem(item?.id, changes);
    setPlaceOrderActive(false);
    setBannerOpen(false);
  };

  const handleResetPrice = () => {
    const newTotalPrice = (quantity * originalPrice).toFixed(0);
    setUnitPrice(originalPrice);
    setTotalPrice(newTotalPrice);
    const changes = {
      quantity: quantity.toString(),
      unitPrice: originalPrice,
      totalPrice: (quantity * originalPrice).toFixed(0),
      isResellerPriceOverride: false,
    };
    updateItem(item?.id, changes);
    setPlaceOrderActive(false);
    setBannerOpen(false);
  };

  const handleDeleteLine = () => {
    setPayloadWithoutNewItem(true);
    setItems((prevItems) =>
      prevItems.filter((i) => {
        return i.id !== item?.id;
      })
    );
    setPlaceOrderActive(false);
    setBannerOpen(false);
  };

  useEffect(() => {
    const newTotalPrice = (quantity * parseFloat(unitPrice)).toFixed(0);
    setTotalPrice(newTotalPrice);
  }, [quantity, unitPrice]);

  useEffect(() => {
    if (item) {
      const quantityValue = parseInt(item.quantity || '1');
      const priceValue = parseFloat(item.unitPrice || '0').toFixed(0);
      setQuantity(quantityValue);
      setUnitPrice(priceValue);
      setTotalPrice(
        item.totalPrice || (quantityValue * parseFloat(priceValue)).toFixed(0)
      );
    }
  }, [item]);

  useEffect(() => {
    setEnableResetPrice(originalPrice !== unitPrice);
  }, [originalPrice, unitPrice]);

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
        {thousandSeparator(item?.unitListPrice.split('.')[0], 0)}
      </td>
      <td className="cmp-flyout-newPurchase__form-table__body__text text-align-end">
        {canEditResellerPrice ? (
          <div className="cmp-flyout-newPurchase__form-table__body__input">
            <input
              type="number"
              name="unitPrice"
              value={unitPrice}
              onChange={(e) => handleChange(e, item?.id)}
            />
            <button
              onClick={handleResetPrice}
              disabled={!enableResetPrice}
              className={
                enableResetPrice
                  ? 'new-purchase-reset--enable'
                  : 'new-purchase-reset--disable'
              }
            >
              <ArrowResetIcon />
            </button>
          </div>
        ) : (
          <div>{thousandSeparator(initialPriceFormatted.split('.')[0], 0)}</div>
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
          <span>{thousandSeparator(totalPrice.split('.')[0], 0)}</span>
          <button onClick={handleDeleteLine}>
            <TrashcanIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LineItem;
