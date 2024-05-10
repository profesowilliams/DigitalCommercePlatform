import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

const Criteria = ({ config, searchCriteria, reportValue }) => {
  const [selectedLabel, setSelectedLabel] = useState(
    config?.last30DaysCriteria
  );
  const predefinedFiltersApplied = useOrderTrackingStore(
    (state) => state.filter.predefinedFiltersApplied
  );

  const { field } = searchCriteria || {};

  const hasDateRangeFilter = predefinedFiltersApplied.some(
    (filterApplied) => 'createdTo' in filterApplied
  );
  const hasOtherFilters = predefinedFiltersApplied.some(
    (filterApplied) => 'filterOptionKey' in filterApplied
  );
  useEffect(() => {
    let label = config?.last30DaysCriteria;
    if (hasDateRangeFilter || field || reportValue) {
      label = '';
    } else if (hasOtherFilters) {
      label = config?.last90DaysCriteria;
    } else {
      label = config?.last30DaysCriteria;
    }
    setSelectedLabel(label);
  }, [field, hasOtherFilters, hasDateRangeFilter, reportValue]);
  return (
    <div className="cmp-order-tracking-grid__criteria">
      {getDictionaryValueOrKey(selectedLabel)}
    </div>
  );
};

export default Criteria;
