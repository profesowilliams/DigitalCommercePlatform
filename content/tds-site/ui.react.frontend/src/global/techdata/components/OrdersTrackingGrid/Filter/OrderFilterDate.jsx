import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import useComputeBranding from './../../../hooks/useComputeBranding';
import moment from 'moment';
import { DateRangePicker } from 'react-dates-gte-react-17';
import 'react-dates-gte-react-17/initialize';
import { ChevronLeftIcon, ChevronRightIcon, } from '../../../../../fluentIcons/FluentIcons';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';
import OrderFilterDateType from './OrderFilterDateType';
import StartEndDisplay from './StartEndDisplay';
import OrderCount from './OrderCount';

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
  const [currentStartDate, setCurrentStartDate] = useState(filters?.from);
  const [currentEndDate, setCurrentEndDate] = useState(filters?.to);

  const [accordionIsOpen, setAccordionIsOpen] = useState(filters?.from && filters?.to && filters?.type);

  const [focusedInput, setFocusedInput] = useState('startDate');

  const dark_teal = '#003031';
  const navIcons = {
    navPrev: <ChevronLeftIcon fill={dark_teal} />,
    navNext: <ChevronRightIcon fill={dark_teal} />,
  };

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
    setCurrentStartDate(undefined);

    // Clear the current end date state
    setCurrentEndDate(undefined);

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

    const from = startDate?.toISOString() || currentStartDate;
    const to = endDate?.toISOString() || currentEndDate;

    // Check if both startDate and endDate are defined
    if (from && to) {
      // Create a new filter object with the provided type, from, and to dates
      const newFilter = {
        type: filters.type,
        from: toShortDateFormat(from),
        to: toShortDateFormat(to)
      };

      onFilterChange(newFilter);

      // Invoke the onChange callback with the new filter object
      onChange(newFilter);
    } else if (startDate) {
      // Update the current start date state if startDate is defined
      setCurrentStartDate(startDate.toISOString());
    } else if (endDate) {
      // Update the current end date state if endDate is defined
      setCurrentEndDate(endDate.toISOString());
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
   * Toggles the state of an accordion
   * @param {Function} set - Setter function to update the state
   * @param {boolean} get - Current state value to toggle
   */
  const handleAccordionClick = (set, get) => {
    // Toggle the state by calling the setter function with the opposite of the current state value
    set(!get);
  };

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
            startDate={currentStartDate ? moment(currentStartDate) : null}
            startDateId="start-date"
            startDatePlaceholderText={translations?.DatePlaceholder}
            endDatePlaceholderText={translations?.DatePlaceholder}
            endDate={currentEndDate ? moment(currentEndDate) : null}
            {...navIcons}
            minimumNights={0}
            endDateId="end-date"
            verticalHeight={280}
            customArrowIcon={<div className="customHyphen"></div>}
            reopenPickerOnClearDates
            keepOpenOnDateSelect={true}
            onDatesChange={onDatesChange}
            isOutsideRange={() => false}
            numberOfMonths={1}
            displayFormat={translations?.DateFormat}
            noBorder={true}
            regular={false}
            transitionDuration={300}
            daySize={30}
            focusedInput={focusedInput}
            onFocusChange={(focusedInput) => {
              const start = document.querySelector('#start-date').value;
              const end = document.querySelector('#end-date').value;
              if (['startDate', 'endDate'].includes(focusedInput)) {
                setFocusedInput(focusedInput);
              } else if (!focusedInput && start === '') {
                setFocusedInput('startDate');
              } else if (end === '') {
                setFocusedInput('endDate');
              } else {
                setFocusedInput('startDate');
              }
            }}
          />
        </div>
        <StartEndDisplay
          translations={translations}
          startDate={
            currentStartDate
              ? moment(currentStartDate).format(translations?.DateFormat)
              : null
          }
          endDate={
            currentEndDate
              ? moment(currentEndDate).format(translations?.DateFormat)
              : null
          }
        />
      </>}
    </div>
  );
};

export default forwardRef(OrderFilterDate);