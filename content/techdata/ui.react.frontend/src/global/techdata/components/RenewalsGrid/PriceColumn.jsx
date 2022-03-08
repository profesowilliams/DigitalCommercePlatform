import React from "react";
import { dateToString, thousandSeparator } from "../../helpers/formatting";

function PriceColumn({ columnValue }) {
  return (
    <div className="cmp-price-column">       
      {thousandSeparator(columnValue?.total)}
    </div>
  );
}

export default PriceColumn;
