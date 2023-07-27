import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function OrderAcknowledgementCard({ content = {}, config }) {
  const { reseller, createdFormatted, poNumber, docType } = content;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.labels?.detailsOrderAcknowledgement)}
      </div>
      <div>
        {reseller?.id && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(
                config?.labels?.detailsCustomerAccountCode
              )}
            </span>
            <span>{reseller?.id}</span>
          </div>
        )}
        {content.createdFormatted && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsOrderDate)}
            </span>
            <span>{createdFormatted}</span>
          </div>
        )}
        {poNumber && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsPurchaseOrderNo)}
            </span>
            <span>{poNumber}</span>
          </div>
        )}
        {docType && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsOrderType)}
            </span>
            <span>{docType}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default OrderAcknowledgementCard;
