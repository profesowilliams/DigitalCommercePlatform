import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function OrderAcknowledgementCard({ content = {}, config }) {
  const { reseller, createdFormatted, customerPO, docTypeText } = content;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(
          config?.orderAcknowledgementLabels?.orderAcknowledgement
        )}
      </div>
      <div className="acknowledgement-card">
        {reseller?.id && (
          <>
            <span>
              {getDictionaryValueOrKey(
                config?.orderAcknowledgementLabels?.customerAccountCode
              )}
            </span>
            <span>{reseller?.id}</span>
          </>
        )}
        {createdFormatted && (
          <>
            <span>
              {getDictionaryValueOrKey(
                config?.orderAcknowledgementLabels?.orderDate
              )}
            </span>
            <span>{createdFormatted}</span>
          </>
        )}
        {customerPO && (
          <>
            <span>
              {getDictionaryValueOrKey(
                config?.orderAcknowledgementLabels?.purchaseOrderNo
              )}
            </span>
            <span>{customerPO}</span>
          </>
        )}
        {docTypeText && (
          <>
            <span>
              {getDictionaryValueOrKey(
                config?.orderAcknowledgementLabels?.orderType
              )}
            </span>
            <span>{docTypeText}</span>
          </>
        )}
      </div>
    </Card>
  );
}

export default OrderAcknowledgementCard;
