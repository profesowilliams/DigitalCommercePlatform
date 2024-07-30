import React, { useState, useEffect } from 'react';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * Component to manage and display criteria based on search parameters and configuration.
 * @param {Object} searchParams - Object containing current search parameters.
 * @param {Function} shouldUpdateCriteriaMessage - Function to determine if the criteria message should be updated.
 */
const Criteria = ({ searchParams, shouldUpdateCriteriaMessage }) => {

  // Get UI translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);

  // Extract translations for the main grid filters
  const translations = uiTranslations?.['OrderTracking.MainGrid'];

  // State to hold the date range info based on criteria
  const [dateRangeInfo, setDateRangeInfo] = useState();

  /**
   * Updates the criteria message based on the current search parameters.
   * Checks for active date range, search, report, and other filters,
   * then determines the appropriate date range information to display.
   */
  const updateCriteriaMessage = () => {
    // Default date range info from translations
    let dateRangeInfoTranslated = translations?.Last30DaysCriteria;
    const filters = searchParams?.filters;
    const search = searchParams?.search;
    const reports = searchParams?.reports;

    // Check if date range filter is active
    const hasDateRangeFilter = filters?.date?.type
      && filters?.date?.from
      && filters?.date?.to;

    // Check if search filter is active
    const hasSearchFilter = search?.field && search?.value;

    // Check if report filter is active
    const hasReportFilter = reports?.value;

    // Check if there are any types or statuses filters
    const hasOtherFilters = filters?.types?.length > 0
      || filters?.statuses?.length > 0;

    console.log('Criteria::useEffect::hasDateRangeFilter[' + hasDateRangeFilter + ']');
    console.log('Criteria::useEffect::hasSearchFilter[' + hasSearchFilter + ']');
    console.log('Criteria::useEffect::hasReportFilter[' + hasReportFilter + ']');
    console.log('Criteria::useEffect::hasOtherFilters[' + hasOtherFilters + ']');

    // Determine the date range info based on active filters
    if (hasDateRangeFilter || hasSearchFilter || hasReportFilter) {
      dateRangeInfoTranslated = '';
    } else if (hasOtherFilters) {
      dateRangeInfoTranslated = translations?.Last90DaysCriteria;
    } else {
      dateRangeInfoTranslated = translations?.Last30DaysCriteria;
    }

    // Update the date range info state
    setDateRangeInfo(dateRangeInfoTranslated);
  }

  // Effect to determine the date range info based on current search parameters
  useEffect(() => {
    console.log('Criteria::useEffect');
    updateCriteriaMessage();    
  }, [searchParams, shouldUpdateCriteriaMessage, translations]);

  return (
    <div className="cmp-order-tracking-grid__criteria">
      {dateRangeInfo}
    </div>
  );
};

export default Criteria;