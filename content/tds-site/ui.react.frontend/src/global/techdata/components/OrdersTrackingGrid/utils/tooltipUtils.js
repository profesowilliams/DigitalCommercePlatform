export function tooltipVal(event) {
  const { value, colDef } = event;
  const { name, contact, address } = value;
  const { line1, line2, line3, city, state, zip, country } = address;
  switch (colDef.headerName) {
    case 'PO Nº':
      return value ? (
        <div>
          {name && <div>{name}</div>}
          {contact.name && <div>{contact.name}</div>}
          {contact.phone && <div>{contact.phone}</div>}
        </div>
      ) : (
        <div>-</div>
      );
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
