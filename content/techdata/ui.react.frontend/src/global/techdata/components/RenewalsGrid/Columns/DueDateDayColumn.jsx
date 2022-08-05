import React from "react";
import differenceInDays from "date-fns/differenceInDays";
import { useRenewalGridState } from "../store/RenewalsStore";
import { ClockAlarmFilled, CalendarFilled } from "../../../../../fluentIcons/FluentIcons";

function DueDateDayColumn({ columnValue }) {
  const dueDaysIcons = useRenewalGridState((state) => state.dueDaysIcons);
  const days = columnValue;
  const dueDaysIconsConstraints = dueDays => {
    const mapped = {
      [dueDays < 0] : "overdue",
      [dueDays >= 0 && dueDays <= 30] : "0-30",
      [dueDays >= 31 && dueDays <= 60] : "31-60",
      [dueDays >= 61] :"61+"
    }
     const [_ , daysRange] = Object.entries(mapped).filter(list => list[0] === "true").flat()
     if (!dueDaysIcons[daysRange]) return null;
     const [fontAwesomeIcon, color] = Object.values(dueDaysIcons[daysRange]);
     if (fontAwesomeIcon === 'fas fa-alarm-clock') return <ClockAlarmFilled fill={color} />
     if (fontAwesomeIcon === 'calendar') return <CalendarFilled fill={color} />
     return  <i style={{ color }} className={fontAwesomeIcon} />;    
  } 
  return (
    <div className="cmp-due-date-day-column">
      {dueDaysIcons && dueDaysIconsConstraints(parseInt(days))}
      <p className="cmp-due-date-days-number">{days}</p>
    </div>
  );
}

export default DueDateDayColumn;
