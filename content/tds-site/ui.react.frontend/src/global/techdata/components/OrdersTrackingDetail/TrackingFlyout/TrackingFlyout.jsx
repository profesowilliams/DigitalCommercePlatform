import React, { useState } from 'react';
import BaseFlyout from '../../BaseFlyout/BaseFlyout';
import { usGet } from '../../../../../utils/api';
import FlyoutTableWithRedirectLinks from '../FlyoutTableWithRedirectLinks/FlyoutTableWithRedirectLinks';
import FlyoutHeaderWithRedirectLinks from '../FlyoutHeaderWithRedirectLinks/FlyoutHeaderWithRedirectLinks';

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
        const urlParams =
          '?' +
          Object.entries(parameters)
            .map((entry) => entry[0] + '=' + entry[1])
            .join('&');
        const trackUrl = baseUrl + urlParams;
        window.open(trackUrl, '_blank');
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
      titleLabel={trackingFlyout.title || 'Track and Trace'}
      buttonLabel={trackingFlyout.cancelButton || 'Cancel'}
      isTDSynnex={isTDSynnex}
      onClickButton={closeFlyout}
    >
      <section className="cmp-flyout-with-links__content">
        <FlyoutHeaderWithRedirectLinks
          data={trackingFlyoutConfig?.line}
          config={trackingFlyout}
        />
        <FlyoutTableWithRedirectLinks
          config={trackingFlyout}
          data={data}
          handleButtonClick={handleTrackAndTrace}
          handleButtonField={'id'}
        />
      </section>
    </BaseFlyout>
  );
}

export default TrackingFlyout;
