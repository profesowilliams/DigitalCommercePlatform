import React from "react";
import { useOrderTrackingStore } from "../store/OrderTrackingStore";
import { setLocalStorageData } from "../utils/gridUtils";
import { ORDER_FILTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";

const OrderCountClear = ({ onQueryChanged, children, filtersRefs }) => {
  const {
    clearAllOrderFilters,
    setFilterClicked,
    setPredefinedFiltersApplied,
    setCustomizedFiltersApplied,
    clearCheckedButNotAppliedOrderFilters,
  } = useOrderTrackingStore((st) => st.effects);
  const onClear = () => {
    clearAllOrderFilters();
    setFilterClicked(false);
    setPredefinedFiltersApplied([]);
    setCustomizedFiltersApplied([]);
    setLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY, {
      dates: [],
      types: [],
      statuses: [],
    });
    filtersRefs = {};
    clearCheckedButNotAppliedOrderFilters();
    onQueryChanged({ onSearchAction: true });
  };
  return (
    <div className={'count-clear tag_dark_teal'}>
      {children}{' '}
      <button className="filter-clear-button" onClick={onClear}>
        &#11198;
      </button>
    </div>
  );
};
export default OrderCountClear;