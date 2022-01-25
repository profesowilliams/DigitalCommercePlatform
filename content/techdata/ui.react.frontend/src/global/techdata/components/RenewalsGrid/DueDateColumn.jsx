import React from "react";
import { dateToString } from "../../helpers/formatting";

function DueDateColumn({ columnValue }) {
  return (
    <div className="cmp-due-date-column"> 
      {dateToString(columnValue.replace(/[zZ]/g,''),"MM/dd/uu")}
    </div>
  );
}

export default DueDateColumn;
