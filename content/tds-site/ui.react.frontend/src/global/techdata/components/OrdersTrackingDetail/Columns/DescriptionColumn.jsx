import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function DescriptionColumn({ line, config }) {
  return (
    <div className="cmp-order-tracking-grid-details__description-row">
      <div className="cmp-order-tracking-grid-details__description-image">
        <img
          className={'cmp-order-tracking-grid-details__description-image-child'}
          src={line?.urlProductImage}
          alt=""
        />
      </div>
      <div className="cmp-order-tracking-grid-details__description-right">
        {line?.displayName &&
          (line?.urlProductDetailsPage ? (
            <a
              href={line?.urlProductDetailsPage}
              target="_blank"
              className="cmp-order-tracking-grid-details__description-link"
            >
              {line?.displayName}
            </a>
          ) : (
            <div className="cmp-order-tracking-grid-details__description-link--disabled">
              {line?.displayName}
            </div>
          ))}
        <div className="cmp-order-tracking-grid-details__description-text">
          {line?.mfrNumber && (
            <div>{`${getDictionaryValueOrKey(config?.itemsLabels?.mfrPartNo)} ${
              line?.mfrNumber
            }`}</div>
          )}
          {line?.tdNumber && (
            <div>{`${getDictionaryValueOrKey(config?.itemsLabels?.tdsPartNo)} ${
              line?.tdNumber
            }`}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DescriptionColumn;
