import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function SoldToCard(props) {
  const { soldTo, config } = props;
  return (
    <Card className="card-container" variant="outlined">
      <Typography className="card-container__title" variant="body1">
        {getDictionaryValueOrKey(config.soldTo)}
      </Typography>
      <Typography variant="body2">
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
      </Typography>
      <Typography className="card-container__bottom" variant="body2">
        {soldTo.phoneNumber && (
          <>
            {getDictionaryValueOrKey(config.phone)} {soldTo.phoneNumber}
            <br />
          </>
        )}
        {soldTo.contactEmail && (
          <>
            {getDictionaryValueOrKey(config.email)} {soldTo.contactEmail}
          </>
        )}
      </Typography>
    </Card>
  );
}

export default SoldToCard;
