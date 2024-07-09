import React from 'react';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';
import OrderFilterTag from './OrderFilterTag';
import { parseISO, format } from 'date-fns';

/**
 * Functional component representing the order filter tags section
 * @param {Object} props - Component props
 * @param {Object} props.dateFromTo - Object containing date range information
 * @param {string[]} props.checkedStatuses - Array of checked status filters
 * @param {string[]} props.checkedTypes - Array of checked type filters
 * @param {Function} props.onChange - Callback function invoked when filters change
 */
function OrderFilterTags({ dateFromTo, checkedStatuses, checkedTypes, onChange }) {
  console.log('OrderFilterTags::init');
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Filters'];

  // get translations from refinements for statuses & types
  const statusRefinements = useOrderTrackingStore((state) => state.refinements)
    .orderStatuses
    .map((status) => {
      return {
        id: status.status,
        label: status.statusText
      }
    });

  const typeRefinements = useOrderTrackingStore((state) => state.refinements)
    .orderTypes
    .map((type) => {
      return {
        id: type.type,
        label: type.typeText
      }
    });

  /**
   * Handles the click event for closing a filter.
   * @param {string} id - The id of the filter to be closed.
   * @param {string} group - The group to which the filter belongs ('status', 'type', or 'date').
   */
  const handleFilterCloseClick = (id, group) => {
    console.log('OrderFilterTags::handleFilterCloseClick');

    // Check if the group is 'status'
    if (group === 'status') {
      // Filter out the specified id from the checkedStatuses array
      const newList = checkedStatuses.filter((x) => x !== id);

      // Call the onChange function with the updated statuses list and existing types and date
      onChange({
        statuses: newList,
        types: checkedTypes,
        date: dateFromTo
      });
    }
    // Check if the group is 'type'
    else if (group === 'type') {
      // Filter out the specified id from the checkedTypes array
      const newList = checkedTypes.filter((x) => x !== id);

      // Call the onChange function with the updated types list and existing statuses and date
      onChange({
        statuses: checkedStatuses,
        types: newList,
        date: dateFromTo
      });
    }
    // Check if the group is 'date'
    else if (group === 'date') {
      // Call the onChange function with date set to undefined and existing statuses and types
      onChange({
        statuses: checkedStatuses,
        types: checkedTypes,
        date: undefined
      });
    }
  };

  /**
   * Returns the label for the date based on the type in dateFromTo
   * @returns {string} - The label corresponding to the date type
   */
  const getDateLabel = () => {
    if (dateFromTo.type === 'orderDate') return translations?.OrderDate;
    if (dateFromTo.type === 'shipDate') return translations?.ShipDate;
    if (dateFromTo.type === 'etaDate') return translations?.ETADate;
    if (dateFromTo.type === 'invoiceDate') return translations?.InvoiceDate;
  };

  /**
   * Formats a date string to a specified format
   * @param {string} dateString - The date string in ISO format
   * @param {string} dateFormat - The format string
   * @returns {string} - The formatted date string
   */
  const formatDateString = (dateString, dateFormat) => {
    // Convert the date string to a Date object
    const date = parseISO(dateString);

    // Format the date using the specified format
    return format(date, dateFormat);
  }

  /**
   * Returns a formatted date range label
   * @param {string} startDate - The start date string in ISO format
   * @param {string} endDate - The end date string in ISO format
   * @returns {string} - A formatted date range label or an empty string if dates are not provided
   */
  const getDateRangeLabel = (startDate, endDate) => {
    // Check if both startDate and endDate are provided
    if (startDate && endDate) {
      // Format the start date using the specified format
      const startDateFormatted = formatDateString(startDate, translations.ShortDateFormat);

      // Format the end date using the specified format
      const endDateFormatted = formatDateString(endDate, translations.ShortDateFormat);

      // Return the formatted date range label
      return `${startDateFormatted} - ${endDateFormatted}`;
    } else {
      // Return an empty string if either startDate or endDate is not provided
      return '';
    }
  };

  /**
   * Creates a list of status filters with labels based on selected statuses
   * @param {Array} checkedStatuses - List of selected statuses
   * @param {Array} statusRefinements - List of status objects containing id and label
   * @returns {Array} - List of filter objects with id, group, and label
   */
  const statusesFilterList = checkedStatuses?.map((status) => {
    // Filter statusRefinements to find the status with a matching id
    var labels = statusRefinements.filter((x) => x.id === status);

    // Return a filter object with id, group, and label
    return {
      id: status,
      group: 'status',
      label: labels.length === 1 ? labels[0].label : status // If a matching label is found, use it; otherwise, use the status id
    };
  });

  /**
   * Creates a list of type filters with labels based on selected types
   * @param {Array} checkedTypes - List of selected types
   * @param {Array} typeRefinements - List of type objects containing id and label
   * @returns {Array} - List of filter objects with id, group, and label
   */
  const typesFilterList = checkedTypes?.map((type) => {
    // Filter typeRefinements to find the type with a matching id
    var labels = typeRefinements.filter((x) => x.id === type);

    // Return a filter object with id, group, and label
    return {
      id: type,
      group: 'type',
      label: labels.length == 1 ? labels[0].label : type // If a matching label is found, use it; otherwise, use the type id
    };
  });

  /**
   * Creates a list of date filters based on the date range in dateFromTo
   * @returns {Array} - List containing a single filter object if the date range is defined, otherwise an empty array
   */
  const dateFromToFilterList = dateFromTo?.type && dateFromTo?.from && dateFromTo?.to
    ? [{
      id: 'date',
      group: 'date',
      label: `${getDateLabel()}: ${getDateRangeLabel(dateFromTo.from, dateFromTo.to)}`
    }] : []; // Return an empty array if any of the date range components are missing

  return (
    <div className={`order-filter-tags-container teal_scroll`}>
      {[
        ...dateFromToFilterList,
        ...statusesFilterList,
        ...typesFilterList,
      ].map((filter) => (
        <OrderFilterTag
          closeHandler={() => handleFilterCloseClick(filter.id, filter?.group)}
          value={filter.label}
          id={filter.id}
          key={`${filter.id}${filter?.group}`}
        />
      ))}
    </div>
  );
}

export default OrderFilterTags;