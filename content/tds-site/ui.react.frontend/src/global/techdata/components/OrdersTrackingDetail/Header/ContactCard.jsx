import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
function ContactCard({ content, config }) {
  const { name, phoneNumber, email } = content?.salesAgent || {};
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.contactLabels?.contact)}
      </div>
      <div className="contact-card">
        {name && (
          <>
            <span>
              {getDictionaryValueOrKey(config?.contactLabels?.contactName)}
            </span>
            <span>{name}</span>
          </>
        )}
        {phoneNumber && (
          <>
            <span>
              {getDictionaryValueOrKey(config?.contactLabels?.contactPhone)}
            </span>
            <span>{phoneNumber}</span>
          </>
        )}
        {email && (
          <>
            <span>
              {getDictionaryValueOrKey(config?.contactLabels?.contactEmail)}
            </span>
            <span>{email}</span>
          </>
        )}
      </div>
    </Card>
  );
}

export default ContactCard;
