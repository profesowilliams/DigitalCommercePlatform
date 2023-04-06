import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

function ContactCard(props) {
  const { soldTo } = props;
  return (
    <Card
      className="card-container"
      sx={{ minWidth: 275, padding: '18px 25px', color: '#000000' }}
      variant="outlined"
    >
      <Typography sx={{ fontWeight: '700' }} variant="body1">
        Contact
      </Typography>
      <Typography variant="body2">
        {soldTo.companyName}
        <br />
        {soldTo.line1}
        <br />
        {soldTo.line2 && (
          <>
            {soldTo.line2}
            <br />
          </>
        )}
        {soldTo.city} {soldTo.state} {soldTo.postalCode} {soldTo.country}
      </Typography>
      <Typography variant="body2">
        Phone: {soldTo.phoneNumber}
        <br />
        Email: {soldTo.contactEmail}
      </Typography>
    </Card>
  );
}

export default ContactCard;
