import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
// TODO: change fields to accountManager 
function ContactCard(props) {
  const { content, config } = props;
  const { created, shipTo, poNumber } = content;

  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.labels?.detailsContact)}
      </div>
      <div>
        {created && shipTo.name && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactName)}
            </span>
            <span>{shipTo.name}</span>
          </div>
        )}
        {poNumber && shipTo.phoneNumber && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactPhone)}
            </span>
            <span>{shipTo.phoneNumber}</span>
          </div>
        )}
        {poNumber && shipTo.email && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactEmail)}
            </span>
            <span>{shipTo.email}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ContactCard;
