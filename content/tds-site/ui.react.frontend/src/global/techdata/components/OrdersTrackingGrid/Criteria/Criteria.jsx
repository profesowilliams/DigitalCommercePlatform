import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

const Criteria = ({ config }) => {
  const predefinedFiltersApplied = useOrderTrackingStore(
    (state) => state.filter.predefinedFiltersApplied
  );
  const enableCriteriaTextOnSearch = useOrderTrackingStore(
    (state) => state.showCriteria
  );

  const isPartialSearch = useOrderTrackingStore(
    (state) => state.isPartialSearch
  );

  const hasDateRangeFilter = predefinedFiltersApplied.some(
    (filterAplied) => 'createdTo' in filterAplied
  );
  const hasOtherFilters = predefinedFiltersApplied.some(
    (filterAplied) => 'filterOptionKey' in filterAplied
  );
  const showCriteria = !hasDateRangeFilter && enableCriteriaTextOnSearch;

  const selectedLabel = showCriteria
    ? hasOtherFilters || isPartialSearch
      ? getDictionaryValueOrKey(config?.last90DaysCriteria)
      : getDictionaryValueOrKey(config?.last30DaysCriteria)
    : '';

  return (
    <div className="cmp-order-tracking-grid__criteria">{selectedLabel}</div>
  );
};

export default Criteria;
