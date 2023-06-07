import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function DescriptionColumn({ line, config }) {
  return (
    <div className="cmp-order-tracking-grid-details__description-column">
      <div className="cmp-order-tracking-grid-details__description-image">
        <img
          className={'cmp-order-tracking-grid-details__description-image-child'}
          src={line?.urlProductImage}
          alt=""
        />
      </div>
      <div className="cmp-order-tracking-grid-details__description-right">
        {line?.displayName && (
          <div className="cmp-order-tracking-grid-details__description-link">{`${line?.displayName}`}</div>
        )}
        <div className="cmp-order-tracking-grid-details__description-text">
          {line?.manufacturerPart && (
            <div>{`${getDictionaryValueOrKey(config?.labels?.lineMfgPartNo)} ${
              line?.manufacturerPart
            }`}</div>
          )}
          {line?.tdNumber && (
            <div>{`${getDictionaryValueOrKey(config?.labels?.lineTdsPartNo)} ${
              line?.tdNumber
            }`}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DescriptionColumn;
