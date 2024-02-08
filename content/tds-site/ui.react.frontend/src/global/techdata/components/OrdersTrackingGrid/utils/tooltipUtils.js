import React from 'react';

export function tooltipVal(event, aemTemplate) {
  const { value, colDef } = event;
  const { name, address } = value || {};
  const { line1, line2, line3, city, state, zip, country } = address || {};

  const renderedTemplate = (aemTemplate) => {
    const replacements = {
      '{name}': name,
      '{address.line1}': line1,
      '{address.line2}': line2,
      '{address.line3}': line3,
      '{address.city}': city,
      '{address.state}': state,
      '{address.zip}': zip,
      '{address.country}': country,
    };
    let replacedTemplate = aemTemplate;
    for (const [placeholder, val] of Object.entries(replacements)) {
      if (val !== undefined && val !== null) {
        replacedTemplate = replacedTemplate.replace(placeholder, val);
      } else {
        replacedTemplate = replacedTemplate.replace(placeholder, '');
      }
    }
    const result = replacedTemplate.split('</br>');
    return result.map((el, idx) => <p key={idx}>{el}</p>);
  };

  switch (colDef.field) {
    case 'customerPO':
      return <div>{value && typeof value === 'string' ? value : '-'}</div>;
    case 'shipTo':
      if (value && aemTemplate) {
        return <div>{renderedTemplate(aemTemplate)}</div>;
      } else if (value && !aemTemplate) {
        return (
          <div>
            {name && <div>{name}</div>}
            {line1 && <div>{line1}</div>}
            {line2 && <div>{line2}</div>}
            {line3 && <div>{line3}</div>}
            {address && (
              <div>
                {city && <span>{city}&nbsp;</span>}
                {state && <span>{state}&nbsp;</span>}
                {zip && <span>{zip}&nbsp;</span>}
                {country && <span>{country}</span>}
              </div>
            )}
          </div>
        );
      } else {
        return <div>-</div>;
      }
    default:
      return null;
  }
}

export function cellMouseOver(event, setToolTipData, aemTemplate) {
  const offset = 2;
  const val = tooltipVal(event, aemTemplate);
  setToolTipData({
    value: val,
    x: event?.event?.pageX + offset,
    y: event?.event?.pageY + offset,
    show: val ? true : false,
  });
}

export function cellMouseOut(setToolTipData) {
  setToolTipData({
    value: '',
    x: 0,
    y: 0,
    show: false,
  });
}
