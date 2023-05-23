import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function SoldToCard(props) {
  const { shipTo, config } = props;
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.labels?.detailsSoldTo)}
      </div>
      {shipTo && (
        <>
          <div>
            {shipTo.companyName && (
              <>
                {shipTo.companyName}
                <br />
              </>
            )}
            {shipTo.line1 && (
              <>
                {shipTo.line1}
                <br />
              </>
            )}
            {shipTo.line2 && (
              <>
                {shipTo.line2}
                <br />
              </>
            )}
            {shipTo.city} {shipTo.state} {shipTo.postalCode} {shipTo.country}
          </div>
          <div className="card-container__bottom">
            {shipTo.phoneNumber && (
              <>
                {getDictionaryValueOrKey(config?.labels?.detailsSoldToPhone)}{' '}
                {shipTo.phoneNumber}
                <br />
              </>
            )}
            {shipTo.contactEmail && (
              <>
                {getDictionaryValueOrKey(config?.labels?.detailsSoldToEmail)}{' '}
                {shipTo.contactEmail}
              </>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

export default SoldToCard;
