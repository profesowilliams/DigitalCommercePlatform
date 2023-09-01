import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function OrderAcknowledgementCard({ content = {}, config }) {
  const { reseller, createdFormatted, poNumber, docType } = content;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(
          config?.orderAcknowledgementLabels?.orderAcknowledgement
        )}
      </div>
      <div>
        {reseller?.id && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(
                config?.orderAcknowledgementLabels?.customerAccountCode
              )}
            </span>
            <span>{reseller?.id}</span>
          </div>
        )}
        {content.createdFormatted && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(
                config?.orderAcknowledgementLabels?.orderDate
              )}
            </span>
            <span>{createdFormatted}</span>
          </div>
        )}
        {poNumber && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(
                config?.orderAcknowledgementLabels?.purchaseOrderNo
              )}
            </span>
            <span>{poNumber}</span>
          </div>
        )}
        {docType && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(
                config?.orderAcknowledgementLabels?.orderType
              )}
            </span>
            <span>{docType}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default OrderAcknowledgementCard;
