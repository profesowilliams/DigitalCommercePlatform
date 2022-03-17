import React from "react";
import { dateToString, thousandSeparator } from "../../helpers/formatting";

function PriceColumn({ value }) {
  return (
    <div className="cmp-price-column">       
      {thousandSeparator(value)}
    </div>
  );
}

export default PriceColumn;
