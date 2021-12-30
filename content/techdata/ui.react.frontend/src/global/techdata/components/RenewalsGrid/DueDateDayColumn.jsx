import React from "react";
import differenceInDays from "date-fns/differenceInDays";

const dueIconsMapped = (days) => {
  if (days >= 0 && days <= 30) {
    return <i style={{ color: "#00B1E2" }} className="fas fa-stopwatch" />;
  } else if (days >= 31 && days <= 60) {
    return <i style={{ color: "#025F97" }} className="fas fa-clock" />;
  } else if (days >= 61) {
    return <i style={{ color: "#21314D" }} className="fas fa-suitcase" />;
  } else if (days < 0) {
    return <i style={{ color: "#F7B500" }} className="fas fa-bell" />;
  } else {
    return " ";
  }
};

function DueDateDayColumn({ columnValue }) {
  const days = differenceInDays(new Date(columnValue), new Date());
  return (
    <div className="cmp-due-date-day-column"> 
      {dueIconsMapped(parseInt(days))}
      {"  "}
      {days}
    </div>
  );
}

export default DueDateDayColumn;
