import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';

function SoldToCard({ shipTo = {}, config }) {
  const {
    companyName,
    line1,
    line2,
    line3,
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
        {getDictionaryValueOrKey(config?.soldToLabels?.soldTo)}
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
        {phoneNumber && (
          <>
            {getDictionaryValueOrKey(config?.soldToLabels?.soldToPhone)}{' '}
            {phoneNumber}
            <br />
          </>
        )}
        {email && (
          <>
            {getDictionaryValueOrKey(config?.soldToLabels?.soldToEmail)} {email}
          </>
        )}
      </div>
    </Card>
  );
}

export default SoldToCard;
