import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function SoldToCard({ shipTo = {}, config }) {
  const {
    companyName,
    line1,
    line2,
    city,
    state,
    zip,
    country,
    phoneNumber,
    email,
  } = shipTo;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.labels?.detailsSoldTo)}
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
        {city} {state} {zip} {country}
      </div>
      <div className="card-container__bottom">
        {phoneNumber && (
          <>
            {getDictionaryValueOrKey(config?.labels?.detailsSoldToPhone)}{' '}
            {phoneNumber}
            <br />
          </>
        )}
        {email && (
          <>
            {getDictionaryValueOrKey(config?.labels?.detailsSoldToEmail)}{' '}
            {email}
          </>
        )}
      </div>
    </Card>
  );
}

export default SoldToCard;
