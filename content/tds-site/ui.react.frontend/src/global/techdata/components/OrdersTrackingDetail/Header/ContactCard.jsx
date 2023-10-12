import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
function ContactCard({ content, config }) {
  const { name, phoneNumber, email } = content?.salesAgent;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.contactLabels?.contact)}
      </div>
      <div>
        {name && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.contactLabels?.contactName)}
            </span>
            <span>{name}</span>
          </div>
        )}
        {phoneNumber && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.contactLabels?.contactPhone)}
            </span>
            <span>{phoneNumber}</span>
          </div>
        )}
        {email && (
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.contactLabels?.contactEmail)}
            </span>
            <span>{email}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ContactCard;
