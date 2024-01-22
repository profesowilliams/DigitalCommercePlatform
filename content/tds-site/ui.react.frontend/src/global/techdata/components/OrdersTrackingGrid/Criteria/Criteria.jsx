import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

function Criteria({ config }) {
  const predefinedFiltersApplied = useOrderTrackingStore(
    (state) => state.filter.predefinedFiltersApplied
  );

  const hasDateRangeFilter = predefinedFiltersApplied.some(
    (filterAplied) => 'createdTo' in filterAplied
  );
  const hasOtherFilters = predefinedFiltersApplied.some(
    (filterAplied) => 'filterOptionKey' in filterAplied
  );
  const showCriteria = !hasDateRangeFilter;

  const selectedLabel = showCriteria
    ? hasOtherFilters
      ? getDictionaryValueOrKey(config?.last90DaysCriteria)
      : getDictionaryValueOrKey(config?.last30DaysCriteria)
    : '';

  return (
    <div className="cmp-order-tracking-grid__criteria">{selectedLabel}</div>
  );
}

export default Criteria;
