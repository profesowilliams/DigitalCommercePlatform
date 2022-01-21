import React from "react";
import {
  DateRangePicker
} from "react-dates";
import "react-dates/initialize";
import { If } from "../../../helpers/If";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import { DateOptionsList } from "./DateOptionsList";
import "./datePicker.scss";


export default function FilterDatePicker({ isOpen = false }) {  

  const [focusedInput, setFocusedInput] = React.useState();
  const effects = useRenewalGridState(state => state.effects);
  const dateSelected = useRenewalGridState(state => state.dateSelected);  
  const customStartDate = useRenewalGridState(state => state.customStartDate); 
  const customEndDate = useRenewalGridState(state => state.customEndDate); 

  return (
    <>
      <div className="filter-datepicker-container">
        <If condition={isOpen}>
          <DateOptionsList/>
          <If condition={dateSelected === 'custom'}>                
          <DateRangePicker     
            startDate={customStartDate}
            startDateId="start-date"              
            endDate={customEndDate}
            endDateId="end-date"            
            verticalHeight={468}   
            showClearDates
            reopenPickerOnClearDates       
            onDatesChange={({ startDate, endDate }) => {              
              effects.setCustomState({key:'customStartDate',value:startDate});         
              effects.setCustomState({key:'customEndDate',value:endDate});        
              if (startDate, endDate ) {
                effects.setDatePickerState(startDate?.toDate(), endDate?.toDate())
              }
            }}
            isOutsideRange={() => false}
            numberOfMonths={1}            
            noBorder={true}
            regular={false}
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

