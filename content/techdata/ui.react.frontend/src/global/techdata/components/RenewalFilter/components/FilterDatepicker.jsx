import React,{ useEffect } from "react";
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
import { getClientLocale, localeByCountry } from "../../../../../utils/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../../../../../fluentIcons/FluentIcons";

function CustomStartEndText() {
  return (
    <div className="customStartEndLabel">
      <div>Start</div>
      <div>End</div>
    </div>
  )
}

export default function FilterDatePicker({ isOpen = false }) {

  const [focusedInput, setFocusedInput] = React.useState("startDate");
  const effects = useRenewalGridState(state => state.effects);
  const aemConfig = useRenewalGridState(state => state.aemConfig);
  const dateSelected = useRenewalGridState(state => state.dateSelected);
  const isTDSynnex = useRenewalGridState( state => state.isTDSynnex || false);
  let customStartDate = useRenewalGridState(state => state.customStartDate);
  let customEndDate = useRenewalGridState(state => state.customEndDate);
  const navIcons = isTDSynnex ?
    { navPrev: <ChevronLeftIcon fill="#003031" />, navNext: <ChevronRightIcon fill="#003031" /> } : null

  useEffect(() =>
    isTDSynnex && document.documentElement.style.setProperty('--main-datepicker-color', '#003031'), [])
  useEffect(() => effects.setDateOptionList(aemConfig?.dateOptionValues), [aemConfig?.dateOptionValues]);
  /**
   * Unfortunately moment is a peer dependency of react-dates.
   * Normal date object wouldn't work.
   */
  if (customStartDate)
    customStartDate = moment(customStartDate);
  if (customEndDate)
    customEndDate = moment(customEndDate);

  function getDisplayFormatBasedOnLocale() {
    const locale = getClientLocale();

    if (locale === localeByCountry.IN || locale === localeByCountry.HK) {
      return "DD-MM-YYYY";
    }

    return "MM/DD/YYYY";
  }

  return (
    <>
      <div className="filter-datepicker-container">
        <If condition={isOpen}>
          <DateOptionsList/>
          <If condition={dateSelected === 'custom'}>
            <CustomStartEndText />
            <DateRangePicker
              startDate={customStartDate}
              startDateId="start-date"
              startDatePlaceholderText="Add date"
              endDatePlaceholderText="Add date"
              endDate={customEndDate}         
              {...navIcons}
              endDateId="end-date"
              verticalHeight={468}
              showDefaultInputIcon={true}
              customInputIcon={<i className="fas fa-calendar-alt"></i>}
              customArrowIcon={<div className="customHyphen"></div>}
              reopenPickerOnClearDates
              keepOpenOnDateSelect={true}
              onDatesChange={({ startDate, endDate }) => {            
                effects.setCustomState({key:'customStartDate',value:startDate || undefined});
                effects.setCustomState({key:'customEndDate',value:endDate || undefined});
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
              displayFormat={getDisplayFormatBasedOnLocale()}
              noBorder={true}
              regular={false}
              transitionDuration={300}
              daySize={30}
              focusedInput={focusedInput}
              onFocusChange={(focusedInput) => {
                focusedInput
                  if (!focusedInput) return;
                  effects.closeAllSections();
                  setFocusedInput(focusedInput)}}
            />          
          </If>
        </If>
      </div>
    </>
  );
}

