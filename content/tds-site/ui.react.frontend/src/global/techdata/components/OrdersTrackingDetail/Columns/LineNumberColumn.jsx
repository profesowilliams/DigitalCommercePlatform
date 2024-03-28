import React from 'react'
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function LineNumberColumn({ line, labels }) {
  return (
    <>
      <span className="cmp-order-tracking-grid-details__manufacturer">
        {line.manufacturer && (
          <>
            <b>{getDictionaryValueOrKey(labels?.shippedByLabel)}: </b>
            {line.manufacturer} <span className="separator">|</span>
          </>
        )}
        {line.TDSynnexPO && (
          <>
            <b>{getDictionaryValueOrKey(labels?.tdSynnexPOLabel)}:</b>{' '}
            {line.TDSynnexPO}
          </>
        )}
      </span>
      <div className="cmp-order-tracking-grid-details__line">{`${line?.line}`}</div>
    </>
  );
}

export default LineNumberColumn