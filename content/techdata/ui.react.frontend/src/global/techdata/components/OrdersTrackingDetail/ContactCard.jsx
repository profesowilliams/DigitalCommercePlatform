import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function ContactCard(props) {
  const { soldTo, config } = props;
  return (
    <Card className="card-container" variant="outlined">
      <Typography className="card-container__title" variant="body1">
        {getDictionaryValueOrKey(config.detailsContact)}
      </Typography>
      <Typography variant="body2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem ea
        fugit voluptas beatae repellendus iure similique provident. Suscipit
        quibusdam id iste, hic, fuga quis perspiciatis maiores numquam aliquam
        eius a?
      </Typography>
    </Card>
  );
}

export default ContactCard;
