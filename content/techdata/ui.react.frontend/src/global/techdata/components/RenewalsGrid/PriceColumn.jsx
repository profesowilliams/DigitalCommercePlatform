import React from "react";
import { dateToString, thousandSeparator } from "../../helpers/formatting";

function PriceColumn({ columnValue }) {
  return (
    <div className="cmp-due-date-column"> 
      {columnValue?.currency}   
      {' '}    
      {thousandSeparator(columnValue?.total)}
    </div>
  );
}

export default PriceColumn;
