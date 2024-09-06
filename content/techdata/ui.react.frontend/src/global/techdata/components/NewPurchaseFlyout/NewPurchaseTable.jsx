import React, { useEffect, useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import LineItem from './LineItem.jsx';
import { thousandSeparator } from "../../helpers/formatting";

const NewPurchaseTable = ({
  data,
  config,
  currency,
  setCurrency,
  defaultCurrency,
  subtotalValue,
  setItems,
  setPlaceOrderActive,
  setPayloadWithoutNewItem,
  setBannerOpen,
}) => {
  const {
    productDetails,
    vendorPartNoNewPurchase,
    listPriceNewPurchase,
    unitPriceNewPurchase,
    qty,
    totalPriceNewPurchase,
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
              {getDictionaryValueOrKey(vendorPartNoNewPurchase)}
            </th>
            <th className="cmp-flyout-newPurchase__form-table__header__title text-align-end">
              <div className="header-content-column">
                <span>{getDictionaryValueOrKey(listPriceNewPurchase)}</span>
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
                <span>{getDictionaryValueOrKey(unitPriceNewPurchase)}</span>
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
                <span>{getDictionaryValueOrKey(totalPriceNewPurchase)}</span>
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
              setPlaceOrderActive={setPlaceOrderActive}
              setPayloadWithoutNewItem={setPayloadWithoutNewItem}
              setBannerOpen={setBannerOpen}
            />
          ))}
        </tbody>
      </table>
      <div className="cmp-flyout-newPurchase__form-table__subtotal">
        <span className="cmp-flyout-newPurchase__form-table__subtotal__title">
          {getDictionaryValueOrKey(subtotal)}
        </span>
        <span className="cmp-flyout-newPurchase__form-table__subtotal__text">
          {thousandSeparator(subtotalValue?.split('.')[0], 0)}
        </span>
      </div>
    </div>
  );
};

export default NewPurchaseTable;
