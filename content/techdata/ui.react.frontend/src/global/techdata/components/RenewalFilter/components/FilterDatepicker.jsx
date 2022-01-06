import React, {useState} from "react";
import {
  DateRangePicker,
  SingleDatePicker,
  DayPickerRangeController,
} from "react-dates";
import "react-dates/initialize";
import "./datePicker.scss";
import { If } from "../../../helpers/If";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import { DateOptionsList } from "./DateOptionsList";

export default function FilterDatePicker({ isOpen = false }) {  

  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [focusedInput, setFocusedInput] = React.useState();
  const effects = useRenewalGridState(state => state.effects);
  const dateSelected = useRenewalGridState(state => state.dateSelected);  


  return (
    <>
      <div className="filter-datepicker-container">
        <If condition={isOpen}>
          <DateOptionsList/>
          <If condition={dateSelected === 'custom'}>                
          <DateRangePicker     
            startDate={startDate}

            startDateId="start-date"  
            endDate={endDate}

            endDateId="end-date"            
            verticalHeight={468}          
            onDatesChange={({ startDate, endDate }) => {
              setStartDate(startDate);
              setEndDate(endDate);
              if (startDate, endDate ) {
                effects.setDatePickerState(startDate.toDate(), endDate.toDate())
              }
            }}
            numberOfMonths={1}            
            noBorder={true}
            regular={true}
            transitionDuration={300}
            daySize={50}
            focusedInput={focusedInput}
            onFocusChange={(focusedInput) => {
                effects.closeAllSections();
                setFocusedInput(focusedInput)}}
          />
          </If> 
        </If>
      </div>     
    </>
  );
}

