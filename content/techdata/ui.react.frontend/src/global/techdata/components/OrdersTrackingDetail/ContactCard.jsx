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
        {content.created && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactName)}
            </span>
            <span>...Name...</span>
          </div>
        )}
        {content.poNumber && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactPhone)}
            </span>
            <span>...Phone...</span>
          </div>
        )}
        {content.poNumber && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactEmail)}
            </span>
            <span>...Email...</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ContactCard;
