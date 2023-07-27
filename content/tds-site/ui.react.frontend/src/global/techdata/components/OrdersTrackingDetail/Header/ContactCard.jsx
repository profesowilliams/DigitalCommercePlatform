import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
// TODO: add fields and from accountManager when it's ready
function ContactCard({ content, config }) {
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.labels?.detailsContact)}
      </div>
      <div>
        {/* {
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactName)}
            </span>
            <span>lorem ipsum</span>
          </div>
        }
        {
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactPhone)}
            </span>
            <span>lorem ipsum</span>
          </div>
        }
        {
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.labels?.detailsContactEmail)}
            </span>
            <span>lorem ipsum</span>
          </div>
        } */}
      </div>
    </Card>
  );
}

export default ContactCard;
