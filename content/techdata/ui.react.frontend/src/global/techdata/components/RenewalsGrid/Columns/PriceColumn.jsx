import React from "react";
import { thousandSeparator } from "../../../helpers/formatting";
import { useRenewalGridState } from "../store/RenewalsStore";

function PriceColumn({ columnValue, currency }) {
  const valueInThousands = currency === 'VND' ? thousandSeparator(columnValue, 0) :
    thousandSeparator(columnValue);
  const { displayCurrencyName = false } = useRenewalGridState(state => state.aemConfig);
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
