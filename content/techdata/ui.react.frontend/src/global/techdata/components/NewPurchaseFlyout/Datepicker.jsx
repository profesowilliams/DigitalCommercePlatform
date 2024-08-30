import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-dates-gte-react-17';
import 'react-dates-gte-react-17/initialize';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../../../fluentIcons/FluentIcons';

export default function DatePicker({
  store,
  isOpen = false,
  startDate,
  endDate,
  setPickedEndDate,
  setDuration,
  setBannerOpen,
  setPlaceOrderActive,
  readOnly = false,
}) {
  const [focusedInput, setFocusedInput] = useState(null);
  const effects = store((state) => state.effects);
  const branding = store((state) => state.branding || '');
  const customEndDate = store((state) => state.customEndDate);
  const momentCustomEndDate = customEndDate ? moment(customEndDate) : null;
  const momentEndDate = endDate ? moment(endDate) : null;
  const momentStartDate = startDate ? moment(startDate) : null;

  const navIcons =
    branding === 'td-synnex'
      ? {
          navPrev: <ChevronLeftIcon fill="#003031" />,
          navNext: <ChevronRightIcon fill="#003031" />,
        }
      : null;

  useEffect(() => {
    const brandingColor =
      branding === 'cmp-grid-techdata'
        ? '#000c21'
        : branding === 'td-synnex'
        ? '#003031'
        : '#000c21';
    document.documentElement.style.setProperty(
      '--main-datepicker-color',
      brandingColor
    );
  }, [branding]);

  useEffect(() => {
    if (customEndDate) {
      const formattedEndDate = moment(customEndDate).format('MM/DD/YYYY');
      setPickedEndDate(formattedEndDate);
    }
  }, [customEndDate, setPickedEndDate]);

  function getDisplayFormatBasedOnLocale() {
    return 'DD/MM/YYYY';
  }

  useEffect(() => {
    setDuration(
      (momentCustomEndDate ? momentCustomEndDate : momentEndDate).diff(
        momentStartDate,
        'days'
      )
    );
  }, [momentEndDate, momentCustomEndDate]);

  return (
    <>
      <div className="new-purchase-datepicker-container">
        <DateRangePicker
          startDate={momentStartDate}
          startDateId="start-date"
          startDatePlaceholderText="Add date"
          endDatePlaceholderText="Add date"
          endDate={momentCustomEndDate ? momentCustomEndDate : momentEndDate}
          {...navIcons}
          endDateId="end-date"
          verticalHeight={468}
          showDefaultInputIcon={false}
          customArrowIcon={<div className="customHyphen"></div>}
          onDatesChange={({ startDate, endDate }) => {
            effects.setCustomState({
              key: 'customEndDate',
              value: endDate?.toISOString() || undefined,
            });
            if (startDate && endDate) {
              effects.setDatePickerState(endDate?.toDate());
            }
            setBannerOpen(false);
            setPlaceOrderActive(false);
          }}
          isOutsideRange={(day) => {
            if (momentStartDate) {
              const threeYearsFromStart = momentStartDate
                .clone()
                .add(3, 'years')
                .subtract(1, 'day');
              if (day.isAfter(threeYearsFromStart, 'day')) {
                return true;
              }
            }
            if (momentEndDate) {
              if (day.isBefore(momentEndDate, 'day')) {
                return true;
              }
            }
            return false;
          }}
          numberOfMonths={1}
          displayFormat={getDisplayFormatBasedOnLocale()}
          noBorder={true}
          regular={false}
          disabled={readOnly}
          transitionDuration={300}
          daySize={30}
          focusedInput={focusedInput} // Ensure controlled focus state
          onFocusChange={(focusedInput) => {
            setFocusedInput(focusedInput); // Handle focus changes
          }}
          initialVisibleMonth={() =>
            momentCustomEndDate ? momentCustomEndDate : momentEndDate
          }
          appendToBody={false}
        />
      </div>
    </>
  );
}
