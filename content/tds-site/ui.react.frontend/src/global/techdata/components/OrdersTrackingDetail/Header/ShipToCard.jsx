import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function ShipToCard({ shipTo = {}, config }) {
  const {
    companyName,
    line1,
    line2,
    line3,
    city,
    state,
    zip,
    country,
    phone,
    email,
  } = shipTo;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.shipToLabels?.shipTo)}
      </div>
      <div>
        {companyName && (
          <>
            {companyName}
            <br />
          </>
        )}
        {line1 && (
          <>
            {line1}
            <br />
          </>
        )}
        {line2 && (
          <>
            {line2}
            <br />
          </>
        )}
        {line3 && (
          <>
            {line3}
            <br />
          </>
        )}
        {city && city} {state && state} {zip && zip} {country && country}
      </div>
      <div className="card-container__bottom">
        {phone && (
          <>
            {getDictionaryValueOrKey(config?.shipToLabels?.shipToPhone)} {phone}
            <br />
          </>
        )}
        {email && (
          <>
            {getDictionaryValueOrKey(config?.shipToLabels?.shipToEmail)} {email}
          </>
        )}
      </div>
    </Card>
  );
}

export default ShipToCard;
