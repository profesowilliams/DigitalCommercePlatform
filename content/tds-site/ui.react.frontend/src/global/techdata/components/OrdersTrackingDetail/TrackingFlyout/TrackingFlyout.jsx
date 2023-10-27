import React, { useState } from 'react';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { usGet } from '../../../../../utils/api';
import FlyoutTableWithRedirectLinks from '../FlyoutTableWithRedirectLinks/FlyoutTableWithRedirectLinks';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function TrackingFlyout({
  store,
  config,
  trackingFlyout = {},
  subheaderReference,
  isTDSynnex,
}) {
  const [dNoteId, setDNoteId] = useState(null);
  const trackingFlyoutConfig = store((st) => st.trackingFlyout);
  const effects = store((st) => st.effects);
  const data = trackingFlyoutConfig?.line?.deliveryNotes;
  const { line, urlProductImage, mfrNumber, tdNumber, displayName } =
    trackingFlyoutConfig?.line || {};

  const orderId = trackingFlyoutConfig?.id;
  const lineId = line;
  const enableLineId = lineId?.length === 1;

  const closeFlyout = () => {
    effects.setCustomState({
      key: 'trackingFlyout',
      value: { data: null, show: false },
    });
  };

  const handleTrackAndTrace = async (dNoteParam) => {
    setDNoteId(dNoteParam);
    try {
      const endpointUrl = enableLineId
        ? `${config.trackDeliveryEndpoint}/${orderId}/${lineId}/${dNoteId}`
        : `${config.trackDeliveryEndpoint}/${orderId}/${dNoteId}`;
      const result = await usGet(endpointUrl);
      const { baseUrl, parameters } = result.data;
      if (baseUrl) {
        const trackAndTraceUrl = new URL(baseUrl);
        if (parameters) {
          Object.entries(parameters).forEach((entry) =>
            trackAndTraceUrl.searchParams.append(entry[0], entry[1])
          );
        }
        window.open(trackAndTraceUrl.href, '_blank');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BaseFlyout
      open={trackingFlyoutConfig?.show}
      onClose={closeFlyout}
      width="425px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={trackingFlyout.titleTracking || 'Track and Trace'}
      buttonLabel={trackingFlyout.cancelButtonTracking || 'Cancel'}
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
                {getDictionaryValueOrKey(trackingFlyout?.mfrNoTracking)}
              </span>
              <span className="cmp-flyout-with-links__content__value">
                {mfrNumber}
              </span>
            </div>
            <div className="cmp-flyout-with-links__content__text">
              <span className="cmp-flyout-with-links__content__label">
                {getDictionaryValueOrKey(trackingFlyout?.tdsNoTracking)}
              </span>
              <span className="cmp-flyout-with-links__content__value">
                {tdNumber}
              </span>
            </div>
          </div>
        </div>
        <div className="cmp-flyout-with-links__content__message">
          {getDictionaryValueOrKey(trackingFlyout?.descriptionTracking)}
        </div>
        <FlyoutTableWithRedirectLinks
          data={data}
          handleButtonClick={handleTrackAndTrace}
          handleButtonField={'id'}
          shipDateField={'actualShipDateFormatted'}
          idLabel={trackingFlyout?.idColumnTracking}
          buttonLabel={trackingFlyout?.buttonTracking}
          shipDateLabel={trackingFlyout?.shipDateColumnTracking}
        />
      </section>
    </BaseFlyout>
  );
}

export default TrackingFlyout;
