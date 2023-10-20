import React from 'react';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import FlyoutTableWithRedirectLinks from '../FlyoutTableWithRedirectLinks/FlyoutTableWithRedirectLinks';
import FlyoutHeaderWithRedirectLinks from '../FlyoutHeaderWithRedirectLinks/FlyoutHeaderWithRedirectLinks';

function ReturnFlyout({
  store,
  returnFlyout = {},
  subheaderReference,
  isTDSynnex,
}) {
  const returnFlyoutConfig = store((st) => st.returnFlyout);
  const effects = store((st) => st.effects);
  const data = returnFlyoutConfig?.line?.invoices;
  const closeFlyout = () => {
    effects.setCustomState({
      key: 'returnFlyout',
      value: { data: null, show: false },
    });
  };

  const handleReturn = (invoiceParam) => {
    const newUrl = invoiceParam;
    window.open(newUrl, '_blank');
  };

  return (
    <BaseFlyout
      open={returnFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={returnFlyout.title || 'Return'}
      buttonLabel={returnFlyout.cancelButton || 'Cancel'}
      isTDSynnex={isTDSynnex}
      onClickButton={closeFlyout}
    >
      <section className="cmp-flyout-with-links__content">
        <FlyoutHeaderWithRedirectLinks
          data={returnFlyoutConfig?.line}
          config={returnFlyout}
        />
        <FlyoutTableWithRedirectLinks
          config={returnFlyout}
          data={data}
          handleButtonClick={handleReturn}
          handleButtonField={'returnURL'}
        />
      </section>
    </BaseFlyout>
  );
}

export default ReturnFlyout;
