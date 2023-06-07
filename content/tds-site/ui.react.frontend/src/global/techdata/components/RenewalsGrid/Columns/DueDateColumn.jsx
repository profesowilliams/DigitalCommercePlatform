import React from "react";

function DueDateColumn({ columnValue }) {
  const displayDueDate = (dueDate) => {
    return dueDate?.length >= 10 ? dueDate?.slice(0, 10) : '';
  }
  return (
    <div className="cmp-due-date-column"> 
      {displayDueDate(columnValue)}
    </div>
  );
}

export default DueDateColumn;