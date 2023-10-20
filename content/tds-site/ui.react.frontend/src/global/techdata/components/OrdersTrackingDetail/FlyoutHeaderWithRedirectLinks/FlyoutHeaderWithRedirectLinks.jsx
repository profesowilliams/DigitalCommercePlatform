import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

export default function FlyoutHeaderWithRedirectLinks({ data, config }) {
  const { urlProductImage, mfrNumber, tdNumber, displayName } = data || {};

  return (
    <>
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
              {getDictionaryValueOrKey(config?.mfrNo)}
            </span>
            <span className="cmp-flyout-with-links__content__value">
              {mfrNumber}
            </span>
          </div>
          <div className="cmp-flyout-with-links__content__text">
            <span className="cmp-flyout-with-links__content__label">
              {getDictionaryValueOrKey(config?.tdsNo)}
            </span>
            <span className="cmp-flyout-with-links__content__value">
              {tdNumber}
            </span>
          </div>
        </div>
      </div>
      <div className="cmp-flyout-with-links__content__message">
        {getDictionaryValueOrKey(config?.descriptionTracking)}
      </div>
    </>
  );
}
