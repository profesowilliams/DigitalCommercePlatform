import React, { useEffect } from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import useIsTDSynnexClass from "./useIsTDSynnexClass";

export function DateOptionsList() {

  const dateOptionsList = useRenewalGridState((state) => state.dateOptionsList);
  const effects = useRenewalGridState((state) => state.effects);

  const { computeClassName } = useIsTDSynnexClass();
  const capitalizedItems = ["overdue"]
  useEffect(()=>effects.checkOptionListSelected(),[]);
  function customCapitalize(dateField){
    return capitalizedItems.includes(dateField) ? {textTransform:'capitalize'} : {}
  }

  return (  
    <div className="datepicker-checks">
      {dateOptionsList.map((item, index) => (
        <li key={index}>
          <input
            type="radio"   
            className={computeClassName("")}         
            name="date"
            key={Math.random()}
            id={index}
            disabled={item.disabled}
            onChange={() => effects.setDateOptionsList(index)}
            value={item.checked}
            defaultChecked={item.checked}
          />
          <label htmlFor={index} style={customCapitalize(item.field)}>
            {item.label}
          </label>
        </li>
      ))}
    </div>
  );
}
