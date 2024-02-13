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
  const template = getDictionaryValueOrKey(
    config?.soldToLabels?.shipToTemplate
  );
  const replacements = {
    '{companyName}': companyName,
    '{line1}': line1,
    '{line2}': line2,
    '{line3}': line3,
    '{city}': city,
    '{state}': state,
    '{zip}': zip,
    '{country}': country,
    '{phoneNumber}': phoneNumber,
    '{email}': email,
  };
  const renderElement = (el, idx) => {
    if (el === phoneNumber || el === email) {
      return (
        <div key={idx} className="card-container__bottom">
          {el === phoneNumber && (
            <p>
              {getDictionaryValueOrKey(config?.soldToLabels?.soldToPhone)}{' '}
              {phoneNumber}
              <br />
            </p>
          )}
          {el === email && (
            <p>
              {getDictionaryValueOrKey(config?.soldToLabels?.soldToEmail)}{' '}
              {email}
            </p>
          )}
        </div>
      );
    } else {
      return (
        <p key={idx} className="card-container__text">
          {el}
        </p>
      );
    }
  };
  const renderTemplate = (aemTemplate) => {
    let replacedTemplate = aemTemplate;
    for (const [placeholder, val] of Object.entries(replacements)) {
      if (val !== undefined && val !== null) {
        replacedTemplate = replacedTemplate.replace(placeholder, val);
      } else {
        replacedTemplate = replacedTemplate.replace(placeholder, '');
      }
    }
    const result = replacedTemplate.split('<br/>');

    return result.map((el, idx) => {
      return renderElement(el, idx);
    });
  };
  return (
    <Card className="card-container" variant="outlined">
      <div className="card-container__title">
        {getDictionaryValueOrKey(config?.soldToLabels?.soldTo)}
      </div>
      <div>
        {template ? (
          renderTemplate(template)
        ) : (
          <>
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
                  {getDictionaryValueOrKey(config?.soldToLabels?.soldToEmail)}{' '}
                  {email}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export default SoldToCard;
