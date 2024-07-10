import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
function ContactCard({ content, config }) {
  const { name, phoneNumber, email, imageUrl } = content?.salesAgent || {};
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.contactLabels?.contact)}
      </div>
      <div className="card-container__horizontal">
        {imageUrl && (
          <img className="card-container__image" src={imageUrl} alt="" />
        )}
        <div className="contact-card">
          {name && <span>{name}</span>}
          {phoneNumber && (
            <div>
              <span>
                {getDictionaryValueOrKey(config?.contactLabels?.contactPhone)}
              </span>{' '}
              <span>{phoneNumber}</span>
            </div>
          )}
          {email && (
            <span className="card-container__email">
              {email}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ContactCard;
