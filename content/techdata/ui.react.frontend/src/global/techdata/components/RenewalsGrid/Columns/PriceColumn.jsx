import React from "react";
import { thousandSeparator } from "../../../helpers/formatting";

function PriceColumn({ columnValue, currency, displayCurrencyName = false }) {
  const valueInThousands = thousandSeparator(columnValue);
  const selectedFormat = displayCurrencyName
    ? `${valueInThousands} ${currency}` 
    : valueInThousands;
  return (
    <div className="cmp-price-column">       
      {selectedFormat}
    </div>
  );
}

export default PriceColumn;
