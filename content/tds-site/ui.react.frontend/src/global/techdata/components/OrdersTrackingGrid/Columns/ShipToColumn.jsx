import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { getDictionaryValue } from '../../../../../utils/utils';

function ShipToColumn({ data, shipToTooltipTemplate }) {
  const { name, address } = data || {};
  const {
    line1,
    line2,
    line3,
    lineName3,
    lineName4,
    city,
    state,
    zip,
    country,
    houseNumber,
  } = address || {};
  const shipToTooltipTemplateDefault =
    '{name}<br/>{address.line1}<br/>{address.line2} {address.houseNumber}<br/>{address.line3}<br/>{address.lineName3}<br/>{address.lineName4}<br/>{address.city} {address.state} {address.zip} {address.country}';
  const template = getDictionaryValue(
    shipToTooltipTemplate,
    shipToTooltipTemplateDefault
  );
  const replacements = {
    '{name}': name,
    '{address.line1}': line1,
    '{address.line2}': line2,
    '{address.line3}': line3,
    '{address.lineName3}': lineName3,
    '{address.lineName4}': lineName4,
    '{address.city}': city,
    '{address.state}': state,
    '{address.zip}': zip,
    '{address.country}': country,
    '{address.houseNumber}': houseNumber,
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
      return <div key={idx}>{el}</div>;
    });
  };
  return data && data ? (
    <div className="status-column-container">
      <Tooltip
        title={renderTemplate(template)}
        placement="top"
        arrow
        disableInteractive={true}
      >
        <span className="status-column-container__text">{data?.name}</span>
      </Tooltip>
    </div>
  ) : (
    <span>-</span>
  );
}

export default ShipToColumn;