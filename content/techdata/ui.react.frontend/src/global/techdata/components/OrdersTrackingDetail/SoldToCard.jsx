import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function SoldToCard(props) {
  const { soldTo, config } = props;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.labels?.detailsSoldTo)}
      </div>
      <div>
        {soldTo.companyName && (
          <>
            {soldTo.companyName}
            <br />
          </>
        )}
        {soldTo.line1 && (
          <>
            {soldTo.line1}
            <br />
          </>
        )}
        {soldTo.line2 && (
          <>
            {soldTo.line2}
            <br />
          </>
        )}
        {soldTo.city} {soldTo.state} {soldTo.postalCode} {soldTo.country}
      </div>
      <div className="card-container__bottom">
        {soldTo.phoneNumber && (
          <>
            {getDictionaryValueOrKey(config?.labels?.detailsSoldToPhone)}{' '}
            {soldTo.phoneNumber}
            <br />
          </>
        )}
        {soldTo.contactEmail && (
          <>
            {getDictionaryValueOrKey(config?.labels?.detailsSoldToEmail)}{' '}
            {soldTo.contactEmail}
          </>
        )}
      </div>
    </Card>
  );
}

export default SoldToCard;
