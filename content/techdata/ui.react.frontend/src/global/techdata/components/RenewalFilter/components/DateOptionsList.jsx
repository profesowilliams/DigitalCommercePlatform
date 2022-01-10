import React, { useState } from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";

export function DateOptionsList() {

  const dateOptionsList = useRenewalGridState((state) => state.dateOptionsList);
  const effects = useRenewalGridState((state) => state.effects);

  return (
    <div className="datepicker-checks">
      {dateOptionsList.map((item, index) => (
        <li key={index}>
          <input
            type="radio"
            name="date"
            key={Math.random()}
            id={index}
            disabled={item.disabled}
            onChange={() => effects.setDateOptionsList(index)}
            value={item.checked}
            defaultChecked={item.checked}
          />
          <label htmlFor={index}>
            {item.label}
          </label>
        </li>
      ))}    
    </div>
  );
}
