import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import useComputeBranding from './../../../hooks/useComputeBranding';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';
import FilterDateType from './FilterDateType';
import StartEndDisplay from './StartEndDisplay';
import OrderCount from './OrderCount';
import DatePredefinedRanges from './DatePredefinedRanges';
import { DateRange } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';
import { getCustomRanges, getFilterDateOptions } from './Utils/translationsUtils';
import moment from 'moment';
import { isSameDay } from 'date-fns';

/**
 * Component for filtering orders by date
 * @param {Function} onChange - Callback function to handle filter changes
 * @param {Array} filterDateOptions - Options for date filtering
 * @param {React.Ref} ref - Reference for the component
 */
const OrderFilterDate = ({ onChange, initialFilter }, ref) => {
  console.log('OrderFilterDate::init');
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Filters'];

  const { computeClassName } = useComputeBranding(useOrderTrackingStore);

  const [filters, setFilters] = useState(initialFilter);
  const [filtersCheckedCount, setFiltersCheckedCount] = useState(filters?.from && filters?.to && filters?.type ? 1 : 0);

  const startDate = !filters?.from || isNaN(moment(filters?.from).toDate().getTime()) ? null : moment(filters?.from).toDate();
  const endDate = !filters?.to || isNaN(moment(filters?.to).toDate().getTime()) ? null : moment(filters?.to).toDate();

  const minDate = new Date('2010');
  const [maxDate, setMaxDate] = useState(new Date);

  const [currentStartDate, setCurrentStartDate] = useState(!startDate ? '' : moment(startDate).format(translations?.DateFormat));
  const [currentEndDate, setCurrentEndDate] = useState(!endDate ? '' : moment(endDate).format(translations?.DateFormat));

  const [selectionRange, setSelectionRange] = useState({
    startDate: startDate || new Date(),
    endDate: endDate || new Date(),
    key: 'selection',
  });

  const [accordionIsOpen, setAccordionIsOpen] = useState(filters?.from && filters?.to && filters?.type);

  const filterDateOptions = getFilterDateOptions(translations);
  const customRanges = getCustomRanges(translations);
  const [selectedRange, setSelectedRange] = useState(customRanges[customRanges.length - 1].key);
  const customDateRangeKey = 'custom';

  /**
   * Handles changes to the radio button selection
   * @param {string} value - The selected radio button value
   */
  const handleFilterDateChange = (value) => {
    console.log('OrderFilterDate::handleFilterDateChange');

    // Clear the current start date state
    setCurrentStartDate('');

    // Clear the current end date state
    setCurrentEndDate('');

    setSelectionRange((prevRange) => ({
      ...prevRange,
      startDate: new Date(),
      endDate: new Date(),
    }));

    // Reset the count of checked filters to 0
    setFiltersCheckedCount(0);

    setSelectedRange(customDateRangeKey);

    // Create filters object with the new type and undefined dates (from, to)
    const newFilter = {
      type: value,
      from: undefined,
      to: undefined
    };

    // Set the updated filters
    setFilters(newFilter);

    // Set calendar max date
    updateMaxDate(value);

    // Trigger the onChange callback with the updated filters
    onChange(newFilter);
  };

  /**
   * Handles the change of date range selection.
   * Depending on whether the selected range is 'Custom' or a predefined range, 
   * it either resets the selection or triggers the appropriate range change logic.
   * 
   * @param {string} rangeKey - The key of the selected date range.
   */
  const handleRangeChange = (rangeKey) => {
    console.log('OrderFilterDate::handleRangeChange');

    // If the selected range is 'Custom', reset to the default date range option.
    if (rangeKey === customDateRangeKey) {
      handleRangeChangeResetToDefaultOption();
    } else {
      // Otherwise, trigger the selection change for the predefined range.
      handleRangeChangeTriggerSelectionChange(rangeKey);
    }
  };

  /**
   * Resets the date range selection to the default option.
   * This function is used when the user selects the 'Custom' date range.
   * It clears any previously set filters and resets the selection range to the current date.
   */
  const handleRangeChangeResetToDefaultOption = () => {
    console.log('OrderFilterDate::handleRangeChangeResetToDefaultOption');
    // Reset the selection range to today's date
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    });

    // Clear the current start date state
    setCurrentStartDate('');

    // Clear the current end date state
    setCurrentEndDate('');

    const newFilter = {
      type: filters.type,
      from: undefined,
      to: undefined
    };

    // Clear any applied filters by setting them to undefined or the default state
    onFilterChange(newFilter);

    // Invoke the onChange callback with the new filter object
    onChange(newFilter);
  };

  /**
   * Triggers the selection change for a predefined date range.
   * This function is used when the user selects a predefined range other than 'Custom'.
   * It updates the selection range and formats the start and end dates for display.
   * 
   * @param {string} rangeKey - The key of the selected predefined date range.
   */
  const handleRangeChangeTriggerSelectionChange = (rangeKey) => {
    console.log('OrderFilterDate::handleRangeChangeTriggerSelectionChange');
    // Find the selected range object based on the provided rangeKey
    const selectedRangeObj = customRanges.find((range) => range.key === rangeKey);

    // Get the new date range from the selected range object
    const newRange = selectedRangeObj.range();

    // Update the selection range state with the new start and end dates
    setSelectionRange({
      startDate: newRange.startDate,
      endDate: newRange.endDate,
      key: 'selection',
    });

    // Set the currently selected range key
    setSelectedRange(rangeKey);

    // Format the start and end dates for display
    const startDate = newRange.startDate;
    const endDate = newRange.endDate;
    setCurrentStartDate(moment(startDate).format(translations?.DateFormat));
    setCurrentEndDate(moment(endDate).format(translations?.DateFormat));

    // Notify the parent component about the date change
    onDatesChange({ startDate, endDate });
  };

  /**
   * Handles changes in the date range picker
   * @param {Object} param0 - Object containing startDate and endDate
   * @param {Date} param0.startDate - The selected start date
   * @param {Date} param0.endDate - The selected end date
   */
  const onDatesChange = ({ startDate, endDate }) => {
    console.log('OrderFilterDate::onDatesChange');

    const from = startDate || moment(currentStartDate, translations?.DateFormat).toDate();
    const to = endDate || moment(currentEndDate, translations?.DateFormat).toDate();

    // Check if both startDate and endDate are defined
    if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
      // Create a new filter object with the provided type, from, and to dates
      const newFilter = {
        type: filters.type,
        from: toShortDateFormat(from?.toISOString()),
        to: toShortDateFormat(to?.toISOString())
      };

      onFilterChange(newFilter);

      // Invoke the onChange callback with the new filter object
      onChange(newFilter);
    }
  };

  /**
   * Handles changes in date filters
   * @param {Object} param - Object containing filter details
   * @param {string} param.type - Type of the filter
   * @param {Date} param.from - Start date of the filter
   * @param {Date} param.to - End date of the filter
   */
  const onFilterChange = ({ type, from, to }) => {
    console.log('OrderFilterDate::onFilterChange');

    // Update the current start date state if startDate is defined
    setCurrentStartDate(from);

    // Update the current end date state if endDate is defined
    setCurrentEndDate(to);

    // Update the calendar state with the new selection range
    setSelectionRange((prevRange) => ({
      ...prevRange,
      startDate: from ? moment(from).toDate() : new Date(),
      endDate: to ? moment(to).toDate() : new Date(),
    }));

    // Create a new filter object with the provided type, from, and to dates
    const newFilter = {
      type: type,
      from: toShortDateFormat(from),
      to: toShortDateFormat(to)
    };

    // Update the filters state with the new filter object
    setFilters(newFilter);

    // Update the filters checked count based on whether type, from, and to are all defined
    setFiltersCheckedCount(type && from && to ? 1 : 0);
  };

  /**
   * Converts a date string to a shortened format containing only year, month, and day
   * @param {string} dateStr - The date string in ISO format
   * @returns {string} - The date string in 'YYYY-MM-DD' format
   */
  const toShortDateFormat = (dateStr) => {
    if (!dateStr) return dateStr;

    // Create a new Date object from the input string
    const date = new Date(dateStr);

    // Extract the year, month, and day from the Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Construct and return the short date format
    return `${year}-${month}-${day}`;
  };

  /**
   * Toggles the state of an accordion
   * @param {Function} set - Setter function to update the state
   * @param {boolean} get - Current state value to toggle
   */
  const handleAccordionClick = (set, get) => {
    // Toggle the state by calling the setter function with the opposite of the current state value
    set(!get);
  };

  /**
   * Matches the selected date range with predefined custom ranges.
   * If the selected dates match any of the predefined ranges, it updates the selected range state accordingly.
   * If no match is found, it sets the selected range to the custom range key.
   * 
   * @param {Date} startDate - The start date of the selected range.
   * @param {Date} endDate - The end date of the selected range.
   */
  const matchRangeWithDates = (startDate, endDate) => {
    console.log('OrderFilterDate::matchRangeWithDates');

    // Default to 'Custom' range if no predefined range matches
    let matchedRangeKey = customDateRangeKey;

    // Iterate over each predefined range to check for a match with the selected dates
    if (startDate && endDate) {
      for (let range of customRanges) {
        const definedRange = range.range();
        if (
          isSameDay(startDate, definedRange.startDate) &&
          isSameDay(endDate, definedRange.endDate)
        ) {
          // If a match is found, update the matchedRange and exit the loop
          matchedRangeKey = range.key;
          break;
        }
      }
    }

    // Update the selected range state with the matched range label or 'Custom'
    setSelectedRange(matchedRangeKey);
  }

  /**
   * Handles the selection of date ranges in the date picker.
   * This function is triggered when the user selects a date range and updates the state accordingly.
   * It also attempts to match the selected dates with predefined ranges.
   * 
   * @param {Object} ranges - Object containing the selected date ranges.
   */
  const handleSelect = (ranges) => {
    console.log('OrderFilterDate::handleSelect');

    // Validate and set the start date, defaulting to the current date if invalid
    const startDate = isNaN(ranges?.selection?.startDate.getTime()) ? new Date() : ranges.selection?.startDate;

    // Validate and set the end date, defaulting to the current date if invalid
    const endDate = isNaN(ranges?.selection?.endDate.getTime()) ? new Date() : ranges.selection.endDate;

    // Attempt to match the selected date range with predefined ranges
    matchRangeWithDates(startDate, endDate);

    // Notify the parent component about the date change
    onDatesChange({ startDate, endDate });
  };


  /**
   * Updates the maximum date based on the type provided.
   *
   * @param {string} type - The type of date to update the maximum date for.
   *                        If the type is 'etaDate', the maximum date is set to one year from the current date.
   *                        Otherwise, the maximum date is set to the current date.
   */
  const updateMaxDate = (type) => {
    console.log('OrderFilterDate::updateMaxDate');

    setMaxDate(type === 'etaDate'
      ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))  // Set max date to one year from current date for 'etaDate'
      : new Date);  // Set max date to current date for other types
  };

  /**
   * Exposes imperative methods to manipulate the date filters from the parent component
   * @param {React.Ref} ref - Reference object to expose imperative methods
   */
  useImperativeHandle(ref, () => ({
    /**
     * Clears the date filters
     */
    clear() {
      console.log('OrderFilterDate::clear');

      // Clear the filters by setting them to undefined or default state
      onFilterChange({
        type: filterDateOptions[0].key,
        from: undefined,
        to: undefined
      });

      // Reset ranges to default
      matchRangeWithDates(undefined, undefined);
    },
    /**
     * Sets the date filters
     * @param {Object} date - The date object containing `type`, `from`, and `to` properties
     */
    set(date) {
      console.log('OrderFilterDate::set');

      const newFilter = {
        type: date?.type || filterDateOptions[0].key,
        from: date?.from,
        to: date?.to
      };

      // Update the filters with the provided date object
      onFilterChange(newFilter);

      // Attempt to match the selected date range with predefined ranges
      if (date?.from && date?.to) {
        matchRangeWithDates(moment(date.from).toDate(), moment(date.to).toDate());
      } else {
        matchRangeWithDates(undefined, undefined);
      }

      // Set calendar max date
      updateMaxDate(newFilter.type);
    }
  }));

  /**
   * Executes an effect only once when the component mounts
   * Sets default filter values if `filters.type` is not already set
   */
  useEffect(() => {
    console.log('OrderFilterDate::useEffect');

    const defaultFilter = {
      type: filterDateOptions[0].key, // Set the first key from `filterDateOptions` as default type
      from: undefined,
      to: undefined
    };

    if (!filters?.type) {
      setFilters(defaultFilter);
    }

    // Attempt to match the selected date range with predefined ranges
    if (filters?.from && filters?.to) {
      matchRangeWithDates(moment(filters.from).toDate(), moment(filters.to).toDate());
    } else {
      matchRangeWithDates(undefined, undefined);
    }

    // Set calendar max date
    updateMaxDate(defaultFilter.type);

    // Call the onDatesChange function to handle any initial setup or state updates
    onDatesChange({
      startDate: undefined,
      endDate: undefined
    });
  }, []);

  /**
   * useEffect hook to update the maximum date in the calendar based on the selected filter type.
   * 
   * This effect will run whenever the `filters.type` changes. 
   * It calls `updateMaxDate` to set the appropriate maximum date in the calendar.
   */
  useEffect(() => {
    console.log('OrderFilterDate::useEffect::type');

    // Update the maximum date in the calendar based on the selected filter type
    updateMaxDate(filters?.type);

    // The effect will re-run whenever filters.type changes
  }, [filters?.type]);

  return (
    <div className={`order-filter-accordion__item ${!accordionIsOpen ? 'separator' : ''}`}>
      <div className="order-filter-accordion__item--group"
        onClick={() => handleAccordionClick(setAccordionIsOpen, accordionIsOpen)}>
        <h3 className={`${accordionIsOpen ? computeClassName('active') : ''}`}>
          {translations?.DateRange}
        </h3>
        <OrderCount>{filtersCheckedCount > 0 ? filtersCheckedCount : ''}</OrderCount>
      </div>
      {accordionIsOpen && <>
        <div className="order-filter-accordion__item--open">
          <div className="check-order-wrapper filterdatetype">
            <FilterDateType
              onRadioChange={handleFilterDateChange}
              options={filterDateOptions}
              selectedValue={filters?.type}
            />
          </div>
          <div className="check-order-wrapper datepredefinedranges">
            <DatePredefinedRanges
              onChangeRadio={handleRangeChange}
              options={customRanges}
              selectedValue={selectedRange}
            />
          </div>
          <StartEndDisplay
            translations={translations}
            startDate={currentStartDate}
            endDate={currentEndDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleSelect}
          />
          <div className="order_datapicker">
            <DateRange
              ranges={[selectionRange]}
              moveRangeOnFirstSelection={false}
              staticRanges={customRanges}
              months={1}
              maxDate={maxDate}
              minDate={minDate}
              onChange={handleSelect}
              editableDateInputs={false}
              preventSnapRefocus={true}
              locale={locales[moment.locale()]}
            />
          </div>
        </div>
      </>}
    </div >
  );
};

export default forwardRef(OrderFilterDate);