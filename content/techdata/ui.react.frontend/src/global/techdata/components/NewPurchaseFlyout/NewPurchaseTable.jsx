import React, { useEffect, useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import LineItem from './LineItem.jsx';

const NewPurchaseTable = ({
  data,
  config,
  currency,
  setCurrency,
  defaultCurrency,
  subtotalValue,
  setItems,
  handleAddProductToGrid,
  setPlaceOrderActive,
  setPayloadWithoutNewItem,
}) => {
  const {
    productDetails,
    vendorPartNo,
    listPrice,
    unitPrice,
    qty,
    totalPrice,
    subtotal,
  } = config || {};
  useEffect(() => {
    setCurrency(data?.currency);
  }, [data?.currency]);
  return (
    <div>
      <table className="cmp-flyout-newPurchase__form-table">
        <thead className="cmp-flyout-newPurchase__form-table__header">
          <tr>
            <th className="cmp-flyout-newPurchase__form-table__header__title text-align-start">
              {getDictionaryValueOrKey(productDetails)}
            </th>
            <th className="cmp-flyout-newPurchase__form-table__header__title text-align-start">
              {getDictionaryValueOrKey(vendorPartNo)}
            </th>
            <th className="cmp-flyout-newPurchase__form-table__header__title text-align-end">
              <div className="header-content-column">
                <span>{getDictionaryValueOrKey(listPrice)}</span>
                <span className="currency">
                  (
                  {data?.items?.unitListPriceCurrency
                    ? data?.items?.unitListPriceCurrency
                    : currency || defaultCurrency || ''}
                  )
                </span>
              </div>
            </th>
            <th className="cmp-flyout-newPurchase__form-table__header__title text-align-end">
              <div className="header-content-column unitPrice-header">
                <span>{getDictionaryValueOrKey(unitPrice)}</span>
                <span className="currency">
                  (
                  {data?.items?.unitPriceCurrency
                    ? data?.items?.unitPriceCurrency
                    : currency || defaultCurrency || ''}
                  )
                </span>
              </div>
            </th>
            <th className="cmp-flyout-newPurchase__form-table__header__title">
              {getDictionaryValueOrKey(qty)}
            </th>
            <th className="cmp-flyout-newPurchase__form-table__header__title text-align-end">
              <div className="header-content-column">
                <span>{getDictionaryValueOrKey(totalPrice)}</span>
                <span className="currency">
                  (
                  {data?.items?.unitPriceCurrency
                    ? data?.items?.unitPriceCurrency
                    : currency || defaultCurrency || ''}
                  )
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="cmp-flyout-newPurchase__form-table__body">
          {data?.items?.map((item, index) => (
            <LineItem
              key={index}
              item={item}
              data={data}
              setItems={setItems}
              handleAddProductToGrid={handleAddProductToGrid}
              setPlaceOrderActive={setPlaceOrderActive}
              setPayloadWithoutNewItem={setPayloadWithoutNewItem}
            />
          ))}
        </tbody>
      </table>
      <div className="cmp-flyout-newPurchase__form-table__subtotal">
        <span className="cmp-flyout-newPurchase__form-table__subtotal__title">
          {getDictionaryValueOrKey(subtotal)}
        </span>
        <span className="cmp-flyout-newPurchase__form-table__subtotal__text">
          {subtotalValue}
        </span>
      </div>
    </div>
  );
};

export default NewPurchaseTable;
