import React, { useState, useEffect } from 'react';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * Component to manage and display criteria based on search parameters and configuration.
 * @param {Object} searchParams - Object containing current search parameters.
 */
const Criteria = ({ searchParams }) => {

  // Get UI translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);

  // Extract translations for the main grid filters
  const translations = uiTranslations?.['OrderTracking.MainGrid'];

  // State to hold the date range info based on criteria
  const [dateRangeInfo, setDateRangeInfo] = useState();

  // Effect to determine the date range info based on current search parameters
  useEffect(() => {
    console.log('Criteria::useEffect');

    // Default date range info from translations
    let dateRangeInfoTranslated = translations?.Last30DaysCriteria;
    const filtersRefs = searchParams?.filtersRefs?.current;
    const search = searchParams?.search?.current;
    const reports = searchParams?.reports?.current;

    // Check if date range filter is active
    const hasDateRangeFilter = filtersRefs?.date?.type
      && filtersRefs?.date?.from
      && filtersRefs?.date?.to;

    // Check if search filter is active
    const hasSearchFilter = search?.field && search?.value;

    // Check if report filter is active
    const hasReportFilter = reports?.value;

    // Check if there are any types or statuses filters
    const hasOtherFilters = filtersRefs?.types?.length > 0
      || filtersRefs?.statuses?.length > 0;

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
  }, [searchParams, translations]);

  return (
    <div className="cmp-order-tracking-grid__criteria">
      {dateRangeInfo}
    </div>
  );
};

export default Criteria;