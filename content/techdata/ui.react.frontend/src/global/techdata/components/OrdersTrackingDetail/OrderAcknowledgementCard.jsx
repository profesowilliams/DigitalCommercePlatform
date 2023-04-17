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
      </div>
    </Card>
  );
}

export default OrderAcknowledgementCard;
