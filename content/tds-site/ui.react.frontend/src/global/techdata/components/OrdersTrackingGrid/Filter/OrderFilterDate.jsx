import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import useComputeBranding from './../../../hooks/useComputeBranding';
import 'react-dates-gte-react-17/initialize';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';
import OrderFilterDateType from './OrderFilterDateType';
import StartEndDisplay from './StartEndDisplay';
import OrderCount from './OrderCount';
import { DateRangePicker, DateInput } from 'react-date-range';
import { customRanges } from './utils/utils';
import moment from 'moment';

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

  const [currentStartDate, setCurrentStartDate] = useState(!startDate ? '' : moment(startDate).format(translations?.DateFormat));
  const [currentEndDate, setCurrentEndDate] = useState(!endDate ? '' : moment(endDate).format(translations?.DateFormat));

  const [selectionRange, setSelectionRange] = useState({
    startDate: startDate || new Date(),
    endDate: endDate || new Date(),
    key: 'selection',
  });

  const [accordionIsOpen, setAccordionIsOpen] = useState(filters?.from && filters?.to && filters?.type);

  const filterDateOptions = [
    {
      key: 'orderDate',
      label: (
        <span className="filter-dateType">
          {translations?.OrderDate}
        </span>
      )
    },
    {
      key: 'shipDate',
      label: (
        <div>
          <span className="filter-dateType">
            {translations?.ShipDate}{' '}
          </span>
          <span className="filter-dateType-description">
            {translations?.PastDateRange}
          </span>
        </div>
      )
    },
    {
      key: 'etaDate',
      label: (
        <div>
          <span className="filter-dateType">
            {translations?.ETADate}{' '}
          </span>
          <span className="filter-dateType-description">
            {translations?.FutureDateRange}
          </span>
        </div>
      )
    },
    {
      key: 'invoiceDate',
      label: (
        <span className="filter-dateType">
          {translations?.InvoiceDate}
        </span>
      )
    },
  ];

  /**
   * Handles changes to the radio button selection
   * @param {string} value - The selected radio button value
   */
  const onChangeRadio = (value) => {
    console.log('OrderFilterDate::onChangeRadio');

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

    // Create filters object with the new type and undefined dates (from, to)
    const newFilter = {
      type: value,
      from: undefined,
      to: undefined
    };

    // Set the updated filters
    setFilters(newFilter);

    // Trigger the onChange callback with the updated filters
    onChange(newFilter);
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
    console.log('OrderFilterDate::onFilterChange'); // Log for debugging

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
   * Handle the selection of date ranges.
   * 
   * @param {Object} ranges - Object containing the selected date ranges.
   */
  const handleSelect = (ranges) => {
    console.log('OrderFilterDate::handleSelect');

    // Call the onDatesChange function with the updated start and end dates
    onDatesChange({
      // If the start date is a valid date, use it; otherwise, use the current date
      startDate: isNaN(ranges?.selection?.startDate.getTime()) ? new Date() : ranges.selection?.startDate,
      // If the end date is a valid date, use it; otherwise, use the current date
      endDate: isNaN(ranges?.selection?.endDate.getTime()) ? new Date() : ranges.selection.endDate
    });
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
    },
    /**
     * Sets the date filters
     * @param {Object} date - The date object containing `type`, `from`, and `to` properties
     */
    set(date) {
      console.log('OrderFilterDate::set');

      // Update the filters with the provided date object
      onFilterChange({
        type: date?.type || filterDateOptions[0].key,
        from: date?.from,
        to: date?.to
      });
    }
  }));

  /**
   * Executes an effect only once when the component mounts
   * Sets default filter values if `filters.type` is not already set
   */
  useEffect(() => {
    if (!filters?.type) {
      setFilters({
        type: filterDateOptions[0].key, // Set the first key from `filterDateOptions` as default type
        from: undefined,
        to: undefined
      });
    }

    // Call the onDatesChange function to handle any initial setup or state updates
    onDatesChange({
      startDate: undefined,
      endDate: undefined
    });
  }, []);

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
        <div className="check-order-wrapper">
          <OrderFilterDateType
            onChangeRadio={onChangeRadio}
            options={filterDateOptions}
            dateType={filters?.type}
          />
        </div>
        <div className="order_datapicker">
          <DateRangePicker
            ranges={[selectionRange]}
            moveRangeOnFirstSelection={false}
            staticRanges={customRanges}
            months={1}
            maxDate={new Date()}
            minDate={new Date('2010')}
            direction="vertical"
            onChange={handleSelect}
            editableDateInputs={false}
            preventSnapRefocus={true}
          />
        </div>
        <StartEndDisplay
          translations={translations}
          startDate={currentStartDate}
          endDate={currentEndDate}
          onChange={handleSelect}
        />
      </>}
    </div>
  );
};

export default forwardRef(OrderFilterDate);