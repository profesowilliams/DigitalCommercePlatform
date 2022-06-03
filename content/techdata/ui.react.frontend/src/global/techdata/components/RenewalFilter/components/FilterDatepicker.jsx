import React from "react";
import moment from "moment";
import {
  DateRangePicker
} from "react-dates";
import "react-dates/initialize";
import { FILTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { If } from "../../../helpers/If";
import { getLocalStorageData, setLocalStorageData } from "../../RenewalsGrid/renewalUtils";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import { DateOptionsList } from "./DateOptionsList";
import "./datePicker.scss";


export default function FilterDatePicker({ isOpen = false }) {

  const [focusedInput, setFocusedInput] = React.useState();
  const effects = useRenewalGridState(state => state.effects);
  const dateSelected = useRenewalGridState(state => state.dateSelected);
  let customStartDate = useRenewalGridState(state => state.customStartDate);
  let customEndDate = useRenewalGridState(state => state.customEndDate);

  /**
   * Unfortunately moment is a peer dependency of react-dates.
   * Normal date object wouldn't work.
   */
  if (customStartDate)
    customStartDate = moment(customStartDate);
  if (customEndDate)
    customEndDate = moment(customEndDate);

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
              showDefaultInputIcon={true}
              customInputIcon={<i className="fas fa-calendar-alt"></i>}
              showClearDates
              reopenPickerOnClearDates
              onDatesChange={({ startDate, endDate }) => {
                effects.setCustomState({key:'customStartDate',value:startDate});
                effects.setCustomState({key:'customEndDate',value:endDate});
                if (startDate, endDate ) {
                  effects.setDatePickerState(startDate?.toDate(), endDate?.toDate())
                  setLocalStorageData(FILTER_LOCAL_STORAGE_KEY, {
                    ...getLocalStorageData(FILTER_LOCAL_STORAGE_KEY),
                    ...{
                      customStartDate: startDate,
                      customEndDate: endDate,
                    },
                  });
                }
              }}
              isOutsideRange={() => false}
              numberOfMonths={1}
              noBorder={true}
              regular={false}
              transitionDuration={300}
              daySize={30}
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

