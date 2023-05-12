import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function OrderAcknowledgementCard(props) {
  const { content, config } = props;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.labels?.detailsOrderAcknowledgement)}
      </div>
      <div>
        {content.reseller?.id && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(
                config?.labels?.detailsCustomerAccountCode
              )}
            </span>
            <span>{content.reseller?.id}</span>
          </div>
        )}
        {content.created && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsOrderDate)}
            </span>
            <span>{content.created}</span>
          </div>
        )}
        {content.poNumber && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsPurchaseOrderNo)}
            </span>
            <span>{content.poNumber}</span>
          </div>
        )}
        {content.docType && (
          <div className="card-container__contentGrid">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsOrderType)}
            </span>
            <span>{content.docType}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default OrderAcknowledgementCard;
