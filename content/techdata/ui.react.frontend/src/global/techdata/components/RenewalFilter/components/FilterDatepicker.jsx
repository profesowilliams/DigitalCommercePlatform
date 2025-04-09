import React, { forwardRef, useState, useEffect } from 'react';
import moment from 'moment';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { DateRangePicker } from 'react-dates-gte-react-17';
import 'react-dates-gte-react-17/initialize';
import { If } from '../../../helpers/If';
import { useRenewalGridState } from '../../RenewalsGrid/store/RenewalsStore';
import { DateOptionsList } from './DateOptionsList';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { Input } from '../../web-components/Input';
// import  Header  from '../../web-components/Header';

function CustomStartEndText() {
  return (
    <div className="customStartEndLabel">
      <div>Start</div>
      <div>End</div>
    </div>
  );
}

export default function FilterDatePicker({ isOpen = false }) {
  const [startDate, setStartDate] = useState(new Date('2014/02/08'));
  const [endDate, setEndDate] = useState(new Date('2014/02/10'));
  const [focusedInput, setFocusedInput] = React.useState('startDate');
  const effects = useRenewalGridState((state) => state.effects);
  const aemConfig = useRenewalGridState((state) => state.aemConfig);
  const dateSelected = useRenewalGridState((state) => state.dateSelected);
  const branding = useRenewalGridState((state) => state.branding || '');
  let customStartDate = useRenewalGridState((state) => state.customStartDate);
  let customEndDate = useRenewalGridState((state) => state.customEndDate);

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const handleChange = (inputType, date) => {
    if (inputType === 'start') {
      setIsStartOpen(!isStartOpen); // Toggle the start input
      setStartDate(date); // Update the start date
    } else if (inputType === 'end') {
      setIsEndOpen(!isEndOpen); // Toggle the end input
      setEndDate(date); // Update the end date
    }
  };

  const handleClick = (inputType) => {
    if (inputType === 'start') {
      setIsStartOpen(!isStartOpen);
      setIsEndOpen(false); // Close the other picker
    } else if (inputType === 'end') {
      setIsEndOpen(!isEndOpen);
      setIsStartOpen(false); // Close the other picker
    }
  };

  const navIcons =
    branding === 'td-synnex'
      ? {
          navPrev: <ChevronLeftIcon fill="#003031" />,
          navNext: <ChevronRightIcon fill="#003031" />,
        }
      : null;
  const DateInput = forwardRef(
    ({ value, onClick, className, label, placeholder }, ref) => (
      <Input
        type="text"
        label={label}
        plcaeholder={placeholder}
        class={className}
        onClick={onClick}
        ref={ref}
        value={format(value, "MMM d, yyyy")}
      />
    )
  );

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
  }, []);

  useEffect(
    () => effects.setDateOptionList(aemConfig?.dateOptionValues),
    [aemConfig?.dateOptionValues]
  );
  /**
   * Unfortunately moment is a peer dependency of react-dates.
   * Normal date object wouldn't work.
   */
  if (customStartDate) customStartDate = format(customStartDate);
  if (customEndDate) customEndDate = format(customEndDate);

  function getDisplayFormatBasedOnLocale() {
    return 'MMM D, YYYY';
  }

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  return (
    <>
      <div className="filter-datepicker-container">
        <If condition={isOpen}>
          <DateOptionsList />
          <If condition={dateSelected === 'custom'}>
            <div className="filter-calendar-container">
              <div className="filter-date-inputs">
                <DateInput
                  className="filter-date-input"
                  placeholder="Start"
                  label="Start"
                  onClick={() => handleClick('start')}
                  value={startDate}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="2"
                  viewBox="0 0 10 2"
                  fill="none"
                  className="filter-date-separator"
                >
                  <path d="M1 1H9" stroke="#888B8D" strokeLinecap="round" />
                </svg>
                <DateInput
                  className="filter-date-input"
                  plcaeholder="End"
                  label="End"
                  onClick={() => handleClick('end')}
                  value={endDate}
                />
              </div>
              <div className="filter-date-calendar-container">
                {isStartOpen && (
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date); // Update the selected start date
                      handleChange('start', date); // Call the handleChange function
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    inline
                    fixedHeight
                    dateFormat={getDisplayFormatBasedOnLocale()}
                    showPopperArrow={false}
                    popperClassName="filter-date-calendar"
                    popperPlacement="bottom"
                    popperModifiers={[
                      {
                        name: 'applyStyles',
                        options: {
                          strategy: 'fixed', // Set strategy to fixed
                        },
                      },
                    ]}
                    renderCustomHeader={({
                      date,
                      changeYear,
                      changeMonth,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled,
                      prevYearButtonDisabled,
                      nextYearButtonDisabled,
                      increaseYear,
                      decreaseYear,
                    }) => (
                      <div className="filter-date-calendar-header">
                        <button
                          onClick={decreaseYear}
                          disabled={prevYearButtonDisabled}
                          className="filter-date-calendar-header-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                          >
                            <path
                              d="M8.35355 12.6464C8.54882 12.8417 8.54882 13.1583 8.35355 13.3536C8.15829 13.5488 7.84171 13.5488 7.64645 13.3536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645L7.64645 3.64645C7.84171 3.45118 8.15829 3.45118 8.35355 3.64645C8.54882 3.84171 8.54882 4.15829 8.35355 4.35355L4.20711 8.5L8.35355 12.6464ZM12.3536 12.6464C12.5488 12.8417 12.5488 13.1583 12.3536 13.3536C12.1583 13.5488 11.8417 13.5488 11.6464 13.3536L7.14645 8.85355C6.95118 8.65829 6.95118 8.34171 7.14645 8.14645L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L8.20711 8.5L12.3536 12.6464Z"
                              fill="#005758"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          className="filter-date-calendar-header-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M10.7603 3.70041C11.0639 3.98226 11.0814 4.45681 10.7996 4.76034L7.27348 8.5L10.7996 12.2397C11.0814 12.5432 11.0639 13.0177 10.7603 13.2996C10.4568 13.5815 9.98226 13.5639 9.7004 13.2603L5.7004 9.01034C5.4332 8.72258 5.4332 8.27743 5.7004 7.98966L9.70041 3.73966C9.98226 3.43613 10.4568 3.41856 10.7603 3.70041Z"
                              fill="#005758"
                            />
                          </svg>
                        </button>
                        <tds-header as="h10">
                          {months[date.getMonth()]} {date.getFullYear()}
                        </tds-header>

                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          className="filter-date-calendar-header-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M6.23966 3.70041C5.93613 3.98226 5.91856 4.45681 6.20041 4.76034L9.72652 8.5L6.20041 12.2397C5.91856 12.5432 5.93613 13.0177 6.23967 13.2996C6.5432 13.5815 7.01775 13.5639 7.2996 13.2603L11.2996 9.01034C11.5668 8.72258 11.5668 8.27743 11.2996 7.98966L7.2996 3.73966C7.01775 3.43613 6.5432 3.41856 6.23966 3.70041Z"
                              fill="#005758"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={increaseYear}
                          disabled={nextYearButtonDisabled}
                          className="filter-date-calendar-header-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                          >
                            <path
                              d="M7.64645 4.35355C7.45118 4.15829 7.45118 3.84171 7.64645 3.64645C7.84171 3.45118 8.15829 3.45118 8.35355 3.64645L12.8536 8.14645C13.0488 8.34171 13.0488 8.65829 12.8536 8.85355L8.35355 13.3536C8.15829 13.5488 7.84171 13.5488 7.64645 13.3536C7.45118 13.1583 7.45118 12.8417 7.64645 12.6464L11.7929 8.5L7.64645 4.35355ZM3.64645 4.35355C3.45118 4.15829 3.45118 3.84171 3.64645 3.64645C3.84171 3.45118 4.15829 3.45118 4.35355 3.64645L8.85355 8.14645C9.04882 8.34171 9.04882 8.65829 8.85355 8.85355L4.35355 13.3536C4.15829 13.5488 3.84171 13.5488 3.64645 13.3536C3.45118 13.1583 3.45118 12.8417 3.64645 12.6464L7.79289 8.5L3.64645 4.35355Z"
                              fill="#005758"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  />
                )}

                {isEndOpen && (
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => {
                      setEndDate(date); // Update the selected start date
                      handleChange('end', date); // Call the handleChange function
                    }}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    inline
                    fixedHeight
                    dateFormat={getDisplayFormatBasedOnLocale()}
                    showPopperArrow={false}
                    popperClassName="filter-date-calendar"
                    popperPlacement="bottom"
                    popperModifiers={[
                      {
                        name: 'applyStyles',
                        options: {
                          strategy: 'fixed', // Set strategy to fixed
                        },
                      },
                    ]}
                    renderCustomHeader={({
                      date,
                      changeYear,
                      changeMonth,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled,
                      prevYearButtonDisabled,
                      nextYearButtonDisabled,
                      increaseYear,
                      decreaseYear,
                    }) => (
                      <div className="filter-date-calendar-header">
                        <button
                          onClick={decreaseYear}
                          disabled={prevYearButtonDisabled}
                          className="filter-date-calendar-header-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                          >
                            <path
                              d="M8.35355 12.6464C8.54882 12.8417 8.54882 13.1583 8.35355 13.3536C8.15829 13.5488 7.84171 13.5488 7.64645 13.3536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645L7.64645 3.64645C7.84171 3.45118 8.15829 3.45118 8.35355 3.64645C8.54882 3.84171 8.54882 4.15829 8.35355 4.35355L4.20711 8.5L8.35355 12.6464ZM12.3536 12.6464C12.5488 12.8417 12.5488 13.1583 12.3536 13.3536C12.1583 13.5488 11.8417 13.5488 11.6464 13.3536L7.14645 8.85355C6.95118 8.65829 6.95118 8.34171 7.14645 8.14645L11.6464 3.64645C11.8417 3.45118 12.1583 3.45118 12.3536 3.64645C12.5488 3.84171 12.5488 4.15829 12.3536 4.35355L8.20711 8.5L12.3536 12.6464Z"
                              fill="#005758"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          className="filter-date-calendar-header-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M10.7603 3.70041C11.0639 3.98226 11.0814 4.45681 10.7996 4.76034L7.27348 8.5L10.7996 12.2397C11.0814 12.5432 11.0639 13.0177 10.7603 13.2996C10.4568 13.5815 9.98226 13.5639 9.7004 13.2603L5.7004 9.01034C5.4332 8.72258 5.4332 8.27743 5.7004 7.98966L9.70041 3.73966C9.98226 3.43613 10.4568 3.41856 10.7603 3.70041Z"
                              fill="#005758"
                            />
                          </svg>
                        </button>
                        <tds-header as="h10">
                          {months[date.getMonth()]} {date.getFullYear()}
                        </tds-header>

                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                          className="filter-date-calendar-header-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M6.23966 3.70041C5.93613 3.98226 5.91856 4.45681 6.20041 4.76034L9.72652 8.5L6.20041 12.2397C5.91856 12.5432 5.93613 13.0177 6.23967 13.2996C6.5432 13.5815 7.01775 13.5639 7.2996 13.2603L11.2996 9.01034C11.5668 8.72258 11.5668 8.27743 11.2996 7.98966L7.2996 3.73966C7.01775 3.43613 6.5432 3.41856 6.23966 3.70041Z"
                              fill="#005758"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={increaseYear}
                          disabled={nextYearButtonDisabled}
                          className="filter-date-calendar-header-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                          >
                            <path
                              d="M7.64645 4.35355C7.45118 4.15829 7.45118 3.84171 7.64645 3.64645C7.84171 3.45118 8.15829 3.45118 8.35355 3.64645L12.8536 8.14645C13.0488 8.34171 13.0488 8.65829 12.8536 8.85355L8.35355 13.3536C8.15829 13.5488 7.84171 13.5488 7.64645 13.3536C7.45118 13.1583 7.45118 12.8417 7.64645 12.6464L11.7929 8.5L7.64645 4.35355ZM3.64645 4.35355C3.45118 4.15829 3.45118 3.84171 3.64645 3.64645C3.84171 3.45118 4.15829 3.45118 4.35355 3.64645L8.85355 8.14645C9.04882 8.34171 9.04882 8.65829 8.85355 8.85355L4.35355 13.3536C4.15829 13.5488 3.84171 13.5488 3.64645 13.3536C3.45118 13.1583 3.45118 12.8417 3.64645 12.6464L7.79289 8.5L3.64645 4.35355Z"
                              fill="#005758"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  />
                )}
              </div>
            </div>
          </If>
        </If>
      </div>
    </>
  );
}
