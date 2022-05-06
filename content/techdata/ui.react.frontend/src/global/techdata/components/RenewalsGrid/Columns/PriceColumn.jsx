import React from "react";
import { thousandSeparator } from "../../../helpers/formatting";

function PriceColumn({ columnValue }) {
  return (
    <div className="cmp-price-column">       
      {thousandSeparator(columnValue) ?? ""}
    </div>
  );
}

export default PriceColumn;
