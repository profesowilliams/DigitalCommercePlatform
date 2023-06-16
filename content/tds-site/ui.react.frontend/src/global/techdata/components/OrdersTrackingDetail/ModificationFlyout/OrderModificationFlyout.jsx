import React, { useState } from 'react';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';
import Counter from '../../Counter/Counter';

function OrderModificationFlyout({
  subheaderReference = '',
  isTDSynnex = true,
  items = [],
  labels = {},
}) {
  const store = useOrderTrackingStore;
  const orderModificationConfig = store((st) => st.orderModificationFlyout);
  const effects = store((st) => st.effects);
  const closeFlyout = () =>
    effects.setCustomState({
      key: 'orderModificationFlyout',
      value: { show: false },
    });

  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons order-modification">
      <button className="primary">
        {getDictionaryValueOrKey(labels.update)}
      </button>
      <button className="secondary">
        {getDictionaryValueOrKey(labels.cancel)}
      </button>
    </div>
  );

  return (
    <BaseFlyout
      open={orderModificationConfig?.show}
      onClose={closeFlyout}
      width="929px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey(labels.modifyOrder)}
      disabledButton={true}
      secondaryButton={null}
      isTDSynnex={isTDSynnex}
      onClickButton={null}
      bottomContent={null}
      buttonsSection={buttonsSection}
    >
      <section className="cmp-flyout__content order-modification">
        <a className="add-new">
          + {getDictionaryValueOrKey(labels.addNewItem)}
        </a>
        <br />
        <p className="edit-quantities">
          {getDictionaryValueOrKey(labels.editQuantities)}
        </p>
        <ul className="cmp-flyout-list">
          {items.map((item) => (
            <li key={item.id} className="cmp-flyout-list__element">
              <div className="cmp-flyout-list__element__number">{item.id}</div>
              <div className="cmp-flyout-list__element__picture">
                <img src={item?.urlProductImage} alt="" />
              </div>
              <div className="cmp-flyout-list__element__title">
                <p>{item.displayName}</p>
                <div>{`${getDictionaryValueOrKey(labels?.lineMfgPartNo)} ${
                  item.manufacturerPart
                }`}</div>
              </div>
              <div className="cmp-flyout-list__element__counter">
                <Counter value={item.quantity} onChange={() => {}} />
              </div>
              <div className="cmp-flyout-list__element__price">
                <p className="cmp-flyout-list__element__price-bold">
                  {getDictionaryValueOrKey(labels.lineTotal)} (
                  {item.unitPriceCurrency})
                </p>
                <p> {item.unitPriceFormatted}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </BaseFlyout>
  );
}

export default OrderModificationFlyout;
