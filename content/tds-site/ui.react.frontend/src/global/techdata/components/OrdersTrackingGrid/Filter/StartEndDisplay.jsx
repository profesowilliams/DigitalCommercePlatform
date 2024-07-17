import React from 'react';
import MaskedDateInput from './MaskedDateInput';
import moment from 'moment';

/**
 * StartEndDisplay component to display start and end date inputs.
 * 
 * @param {Object} props - Properties passed to the component.
 * @param {Object} props.translations - Translations object, including date format.
 * @param {Date|string} props.startDate - Initial start date value.
 * @param {Date|string} props.endDate - Initial end date value.
 * @param {Function} props.onChange - Function called when the date values change.
 */
export default function StartEndDisplay({ translations, startDate, endDate, onChange }) {
  console.log('StartEndDisplay::init');

  /**
   * Handler for changes to the start date.
   * 
   * @param {Date} date - New start date.
   */
  const onStartDateChange = (date) => {
    console.log('StartEndDisplay::onStartDateChange');

    const newEndDate = moment(endDate).toDate();

    // Ensure the start date does not exceed the end date
    if (date > newEndDate)
      date = newEndDate;

    onChange({
      selection: {
        startDate: date,
        endDate: newEndDate
      }
    });
  };

  /**
   * Handler for changes to the end date.
   * 
   * @param {Date} date - New end date.
   */
  const onEndDateChange = (date) => {
    console.log('StartEndDisplay::onEndDateChange');

    const newStartDate = moment(startDate).toDate();

    // Ensure the end date is not before the start date
    if (date < newStartDate)
      date = newStartDate;

    onChange({
      selection: {
        startDate: newStartDate,
        endDate: date
      }
    });
  };

  return (
    <div className="start-end-display">
      <div className="start-end-display__start">
        <div className="start-end-display__start__label">
          {translations?.Start}
        </div>
        <div className="start-end-display__start__date">
          <MaskedDateInput
            translations={translations}
            value={startDate}
            onChange={onStartDateChange}
          />
        </div>
      </div>
      <div className="start-end-display__hyphen"></div>
      <div className="start-end-display__end">
        <div className="start-end-display__end__label">
          {translations?.End}
        </div>
        <div className="start-end-display__end__date">
          <MaskedDateInput
            translations={translations}
            value={endDate}
            onChange={onEndDateChange}
          />
        </div>
      </div>
    </div>
  );
}
