import * as React from 'react';
import Card from '@mui/material/Card';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
// TODO: add fields and from accountManager when it's ready
function ContactCard({ content, config }) {
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.contactLabels?.contact)}
      </div>
      <div>
        {/* {
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.contactLabels?.contactName)}
            </span>
            <span>lorem ipsum</span>
          </div>
        }
        {
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.contactLabels?.contactPhone)}
            </span>
            <span>lorem ipsum</span>
          </div>
        }
        {
          <div className="card-container__contentGridContact">
            <span>
              {getDictionaryValueOrKey(config?.contactLabels?.contactEmail)}
            </span>
            <span>lorem ipsum</span>
          </div>
        } */}
      </div>
    </Card>
  );
}

export default ContactCard;
