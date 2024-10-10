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
  const initialQuantity = parseInt(item?.quantity, 10) || 1;
  const initialPriceFormatted = parseInt(item?.unitPrice, 10).toString();
  const originalPrice = parseInt(item?.unitPriceOriginal, 10).toString();
  const [quantity, setQuantity] = useState(initialQuantity);
  const [unitPrice, setUnitPrice] = useState(initialPriceFormatted || '0');
  const [formattedUnitPrice, setFormattedUnitPrice] = useState(thousandSeparator(initialPriceFormatted) || '0');
  const [totalPrice, setTotalPrice] = useState(
    (initialQuantity * parseInt(unitPrice, 10)).toString()
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
    const inputValue = event.target.value.replace(/,/g, ''); // Remove commas
    if (inputValue === '' || /^[0-9]*$/.test(inputValue)) {
      // Allow empty input or numbers only
      setUnitPrice(inputValue); // Update raw unitPrice without formatting
      setFormattedUnitPrice(inputValue); // Update displayed value

      const numericValue = inputValue === '' ? 0 : parseInt(inputValue, 10);
      const newTotalPrice = (quantity * numericValue).toString();
      setTotalPrice(newTotalPrice);

      const changes = {
        quantity: quantity.toString(),
        unitPrice: numericValue.toString(),
        totalPrice: newTotalPrice,
        isResellerPriceOverride: numericValue !== parseInt(originalPrice, 10),
      };
      updateItem(itemId, changes);
      setPlaceOrderActive(false);
      setBannerOpen(false);
    }
  };

  const handleBlur = () => {
    // Format unitPrice with commas on blur
    if (unitPrice !== '') {
      setFormattedUnitPrice(thousandSeparator(parseInt(unitPrice, 10).toString(),0));
    }
  };

  const handleQuantityChange = (newQuantity) => {
    const integerQuantity = parseInt(newQuantity, 10);
    setQuantity(integerQuantity);
    const numericUnitPrice = parseInt(unitPrice, 10) || 0;
    const newTotalPrice = (integerQuantity * numericUnitPrice).toString();
    setTotalPrice(newTotalPrice);
    const changes = {
      quantity: integerQuantity.toString(),
      unitPrice: numericUnitPrice.toString(),
      totalPrice: newTotalPrice,
      isResellerPriceOverride: numericUnitPrice !== parseInt(originalPrice, 10),
    };
    updateItem(item?.id, changes);
    setPlaceOrderActive(false);
    setBannerOpen(false);
  };

  const handleResetPrice = () => {
    setUnitPrice(originalPrice);
    setFormattedUnitPrice(thousandSeparator(originalPrice,0));
    const newTotalPrice = (quantity * parseInt(originalPrice, 10)).toString();
    setTotalPrice(newTotalPrice);
    const changes = {
      quantity: quantity.toString(),
      unitPrice: originalPrice,
      totalPrice: newTotalPrice,
      isResellerPriceOverride: false,
    };
    updateItem(item?.id, changes);
    setPlaceOrderActive(false);
    setBannerOpen(false);
  };

  const handleDeleteLine = () => {
    setPayloadWithoutNewItem(true);
    setItems((prevItems) =>
      prevItems.filter((i) => i.id !== item?.id)
    );
    setPlaceOrderActive(false);
    setBannerOpen(false);
  };

  useEffect(() => {
    const numericUnitPrice = parseInt(unitPrice, 10) || 0;
    const newTotalPrice = (quantity * numericUnitPrice).toString();
    setTotalPrice(newTotalPrice);
  }, [quantity, unitPrice]);

  useEffect(() => {
    if (item) {
      const quantityValue = parseInt(item.quantity || '1', 10);
      const priceValue = parseInt(item.unitPrice || '0', 10).toString();
      setQuantity(quantityValue);
      setUnitPrice(priceValue);
      setFormattedUnitPrice(thousandSeparator(priceValue,0));
      setTotalPrice(
        item.totalPrice || (quantityValue * parseInt(priceValue, 10)).toString()
      );
    }
  }, [item]);

  useEffect(() => {
    setEnableResetPrice(parseInt(originalPrice, 10) !== parseInt(unitPrice, 10));
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
              type="text"
              name="unitPrice"
              value={formattedUnitPrice}
              onChange={(e) => handleChange(e, item?.id)}
              onBlur={handleBlur}
              placeholder="0"
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
          <div>{thousandSeparator(initialPriceFormatted, 0)}</div>
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
          <span>{thousandSeparator(totalPrice, 0)}</span>
          <button onClick={handleDeleteLine}>
            <TrashcanIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LineItem;