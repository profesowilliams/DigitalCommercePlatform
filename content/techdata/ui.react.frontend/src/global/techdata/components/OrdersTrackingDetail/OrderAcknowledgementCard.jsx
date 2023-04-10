import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function OrderAcknowledgementCard(props) {
  const { content, config } = props;
  return (
    <Card className="card-container" variant="outlined">
      <Typography className="card-container__title" variant="body1">
        {getDictionaryValueOrKey(config?.labels?.detailsOrderAcknowledgement)}
      </Typography>
      <Typography variant="body2">
        {content.created && (
          <div className="card-container__contentGrid">
            <span>{getDictionaryValueOrKey(config?.labels?.detailsOrderDate)}</span>
            <span>{content.created}</span>
          </div>
        )}
        {content.poNumber && (
          <div className="card-container__contentGrid">
            <span>{getDictionaryValueOrKey(config?.labels?.detailsPurchaseOrderNo)}</span>
            <span>{content.poNumber}</span>
          </div>
        )}
      </Typography>
    </Card>
  );
}

export default OrderAcknowledgementCard;
