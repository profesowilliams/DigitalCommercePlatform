import React, { useState, useEffect } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { useOrderTrackingStore } from './../store/OrderTrackingStore';

const Criteria = ({ config, searchCriteria }) => {
  const predefinedFiltersApplied = useOrderTrackingStore(
    (state) => state.filter.predefinedFiltersApplied
  );
  const [selectedLabel, setSelectedLabel] = useState(
    config?.last30DaysCriteria
  );

  const { value, field } = searchCriteria || {};
  const isTDSynnexIdField = ['Id', 'InvoiceId', 'DeliveryNote'].includes(field);
  const isCustomerPOField = field === 'CustomerPO';
  const isSerialNoField = field === 'SerialNo';
  const isSearchForExactTDSynnexId = isTDSynnexIdField && value.length === 10;
  const isSearchForPartialId = isTDSynnexIdField && value.length < 10;
  const isSearchForLongerPOId = isCustomerPOField && value.length > 4;
  const isSearchForShorterPOId = isCustomerPOField && value.length < 5;
  const hasDateRangeFilter = predefinedFiltersApplied.some(
    (filterApplied) => 'createdTo' in filterApplied
  );
  const hasOtherFilters = predefinedFiltersApplied.some(
    (filterApplied) => 'filterOptionKey' in filterApplied
  );

  const getLabelBasedOnFilters =
    hasOtherFilters && !hasDateRangeFilter
      ? config?.last90DaysCriteria
      : hasDateRangeFilter
      ? ''
      : config?.last30DaysCriteria;

  useEffect(() => {
    let label = config?.last30DaysCriteria;
    if (isTDSynnexIdField) {
      label = isSearchForExactTDSynnexId
        ? ''
        : isSearchForPartialId
        ? getLabelBasedOnFilters
        : config?.last30DaysCriteria;
    } else if (isCustomerPOField) {
      label = isSearchForLongerPOId
        ? ''
        : isSearchForShorterPOId
        ? getLabelBasedOnFilters
        : config?.last30DaysCriteria;
    } else if (isSerialNoField) {
      label = hasDateRangeFilter ? '' : config?.last90DaysCriteria;
    } else if (hasOtherFilters) {
      label = hasDateRangeFilter ? '' : config?.last90DaysCriteria;
    }
      setSelectedLabel(label);
  }, [field, value?.length, hasOtherFilters, hasDateRangeFilter]);

  return (
    <div className="cmp-order-tracking-grid__criteria">
      {getDictionaryValueOrKey(selectedLabel)}
    </div>
  );
};

export default Criteria;
