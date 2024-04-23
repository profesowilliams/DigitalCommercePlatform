import React from 'react';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import FlyoutTableWithRedirectLinks from '../FlyoutTableWithRedirectLinks/FlyoutTableWithRedirectLinks';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from '../../OrdersTrackingGrid/store/OrderTrackingStore';

function ReturnFlyout({ returnFlyout = {}, subheaderReference, isTDSynnex }) {
  const returnFlyoutConfig = useOrderTrackingStore((st) => st.returnFlyout);
  const effects = useOrderTrackingStore((st) => st.effects);
  const data = returnFlyoutConfig?.line?.invoices;
  const { urlProductImage, mfrNumber, tdNumber, displayName } =
    returnFlyoutConfig?.line || {};
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
      width="360px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={returnFlyout.titleReturn || 'Return'}
      buttonLabel={returnFlyout.cancelButtonReturn || 'Cancel'}
      isTDSynnex={isTDSynnex}
      onClickButton={closeFlyout}
    >
      <section className="cmp-flyout-with-links__content">
        <div className="cmp-flyout-with-links__content__contentFlex">
          <div className="cmp-flyout-with-links__content__detailsLeft">
            <img
              src={urlProductImage}
              alt=""
              className="cmp-flyout-with-links__content__image"
            />
          </div>
          <div className="cmp-flyout-with-links__content__detailsRight">
            <span className="cmp-flyout-with-links__content__name">
              {displayName}
            </span>
            <div className="cmp-flyout-with-links__content__text">
              <span className="cmp-flyout-with-links__content__label">
                {getDictionaryValueOrKey(returnFlyout?.mfrNoReturn)}
              </span>
              <span className="cmp-flyout-with-links__content__value">
                {mfrNumber}
              </span>
            </div>
            <div className="cmp-flyout-with-links__content__text">
              <span className="cmp-flyout-with-links__content__label">
                {getDictionaryValueOrKey(returnFlyout?.tdsNoReturn)}
              </span>
              <span className="cmp-flyout-with-links__content__value">
                {tdNumber}
              </span>
            </div>
          </div>
        </div>
        <div className="cmp-flyout-with-links__content__message">
          {getDictionaryValueOrKey(returnFlyout?.descriptionReturn)}
        </div>
        <FlyoutTableWithRedirectLinks
          data={data}
          handleButtonClick={handleReturn}
          handleButtonField={'returnURL'}
          shipDateField={'dateFormatted'}
          idLabel={returnFlyout?.idColumnReturn}
          buttonLabel={returnFlyout?.buttonReturn}
          shipDateLabel={returnFlyout?.shipDateColumnReturn}
        />
      </section>
    </BaseFlyout>
  );
}

export default ReturnFlyout;
