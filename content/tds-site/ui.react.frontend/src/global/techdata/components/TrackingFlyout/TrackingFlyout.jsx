import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { usGet } from '../../../../utils/api';

function TrackingFlyout({
  store,
  config,
  trackingFlyout = {},
  subheaderReference,
  isTDSynnex,
}) {
  const [dNoteId, setDNoteId] = useState(null);
  const [trackUrl, setTrackUrl] = useState('');
  const trackingFlyoutConfig = store((st) => st.trackingFlyout);
  const effects = store((st) => st.effects);
  const data = trackingFlyoutConfig?.line?.deliveryNotes;
  const { line, urlProductImage, mfrNumber, tdNumber, displayName } =
    trackingFlyoutConfig?.line || {};
  const orderId = trackingFlyoutConfig?.id;
  const lineId = line;
  const closeFlyout = () => {
    effects.setCustomState({
      key: 'trackingFlyout',
      value: { data: null, show: false },
    });
  };

  const handleTrackAndTrace = (dNoteParam) => {
    setDNoteId(dNoteParam);
    if (trackUrl) {
      window.open(trackUrl, '_blank');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await usGet(
          `${config.trackDeliveryEndpoint}/${orderId}/${lineId}/${dNoteId}`
        );
        const { baseUrl, parameters } = result.data;
        if (baseUrl) {
          const urlParams =
            '?' +
            Object.entries(parameters)
              .map((entry) => entry[0] + '=' + entry[1])
              .join('&');
          setTrackUrl(baseUrl + urlParams);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dNoteId]);
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
      <section className="cmp-flyout-tracking__content">
        <div className="cmp-flyout-tracking__content__contentFlex">
          <div className="cmp-flyout-tracking__content__detailsLeft">
            <img
              src={urlProductImage}
              alt=""
              className="cmp-flyout-tracking__content__image"
            />
          </div>
          <div className="cmp-flyout-tracking__content__detailsRight">
            <span className="cmp-flyout-tracking__content__name">
              {displayName}
            </span>
            <div className="cmp-flyout-tracking__content__text">
              <span className="cmp-flyout-tracking__content__label">
                {getDictionaryValueOrKey(trackingFlyout?.mfrNo)}
              </span>
              <span className="cmp-flyout-tracking__content__value">
                {mfrNumber}
              </span>
            </div>
            <div className="cmp-flyout-tracking__content__text">
              <span className="cmp-flyout-tracking__content__label">
                {getDictionaryValueOrKey(trackingFlyout?.tdsNo)}
              </span>
              <span className="cmp-flyout-tracking__content__value">
                {tdNumber}
              </span>
            </div>
          </div>
        </div>
        <div className="cmp-flyout-tracking__content__message">
          {getDictionaryValueOrKey(trackingFlyout?.description)}
        </div>
        <div>
          <div className="cmp-flyout-tracking__content__tableHeader">
            <span className="cmp-flyout-tracking__content__bold">
              {getDictionaryValueOrKey(trackingFlyout?.dNoteColumn)}
            </span>
            <span className="cmp-flyout-tracking__content__bold">
              {getDictionaryValueOrKey(trackingFlyout?.shipDateColumn)}
            </span>
            <span className="cmp-flyout-tracking__content__bold"></span>
          </div>
          <div>
            {data?.map((dnote) => (
              <div
                key={dnote?.id}
                className="cmp-flyout-tracking__content__tableContent"
              >
                <span className="cmp-flyout-tracking__content__tableValue">
                  {dnote?.id}
                </span>
                <span className="cmp-flyout-tracking__content__tableValue">
                  {dnote?.dateFormatted}
                </span>
                <div
                  className="cmp-flyout-tracking__content__button"
                  onClick={() => handleTrackAndTrace(dnote?.id)}
                >
                  {getDictionaryValueOrKey(trackingFlyout?.button)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </BaseFlyout>
  );
}

export default TrackingFlyout;
