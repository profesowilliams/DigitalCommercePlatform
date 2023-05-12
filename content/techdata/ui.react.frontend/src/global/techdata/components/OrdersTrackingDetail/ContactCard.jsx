import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function ContactCard(props) {
  const { content, config } = props;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.labels?.detailsContact)}
      </div>
      <div>
        {content.created && content.shipTo.contact?.name && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactName)}
            </span>
            <span>{content.shipTo.contact?.name}</span>
          </div>
        )}
        {content.poNumber && content.shipTo.contact?.phone && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactPhone)}
            </span>
            <span>{content.shipTo.contact?.phone}</span>
          </div>
        )}
        {content.poNumber && content.shipTo.contact?.phone && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactEmail)}
            </span>
            <span>{content.shipTo.contact?.email}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ContactCard;
