import React from "react";
import { getLocaleFormattedDate } from "../../../../../utils/utils";

function DueDateColumn({ columnValue }) {
  return (
    <div className="cmp-due-date-column"> 
      {getLocaleFormattedDate(columnValue)}
    </div>
  );
}

export default DueDateColumn;
