import React from 'react';

export function tooltipVal(event) {
  const { value, colDef } = event;
  const { name, address } = value || {};
  const { line1, line2, line3, city, state, zip, country } = address || {};
  switch (colDef.headerName) {
    case 'PO Nº':
      return <div>{value ? value : '-'}</div>;
    case 'Ship to':
      return value ? (
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
      ) : (
        <div>-</div>
      );
    default:
      return null;
  }
}

export function cellMouseOver(event, setToolTipData) {
  const offset = 2;
  const val = tooltipVal(event);
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
