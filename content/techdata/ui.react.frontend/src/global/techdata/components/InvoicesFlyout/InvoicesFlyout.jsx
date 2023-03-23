import React from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function InvoicesFlyout({ store, invoicesFlyout, subheaderReference }) {
  const invoicesFlyoutConfig = store((st) => st.invoicesFlyout);
  const effects = store((st) => st.effects);

  const closeFlyout = () =>
    effects.setCustomState({ key: 'invoicesFlyout', value: { show: false } });
  return (
    <BaseFlyout
      open={invoicesFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={invoicesFlyout.title || 'Invoices'}
      buttonLabel={invoicesFlyout.button || 'Download selected'}
    >
      <section className="cmp-flyout__content">
        <div className="cmp-flyout__content-description">
          <span className="cmp-flyout__content-bold">
            {getDictionaryValueOrKey(invoicesFlyout.orderNo)}
            {'  '}
          </span>
          {invoicesFlyoutConfig?.id}
        </div>
        <div className="cmp-flyout__content-description">
          {getDictionaryValueOrKey(invoicesFlyout.description)}
        </div>
      </section>
    </BaseFlyout>
  );
}

export default InvoicesFlyout;
