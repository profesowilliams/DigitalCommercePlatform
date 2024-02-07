import React from "react";
import { useOrderTrackingStore } from "../store/OrderTrackingStore";
import { setLocalStorageData } from "../utils/gridUtils";
import { ORDER_FILTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { FilterClearIcon } from "../../../../../fluentIcons/FluentIcons";

const OrderCountClear = ({ onQueryChanged, children, filtersRefs }) => {
  const {
    clearAllOrderFilters,
    setFilterClicked,
    setPredefinedFiltersApplied,
    setCustomizedFiltersApplied,
    clearCheckedButNotAppliedOrderFilters,
  } = useOrderTrackingStore((st) => st.effects);
  const onClear = () => {
    filtersRefs.current = {};
    clearAllOrderFilters();
    setFilterClicked(false);
    setPredefinedFiltersApplied([]);
    setCustomizedFiltersApplied([]);
    setLocalStorageData(ORDER_FILTER_LOCAL_STORAGE_KEY, {
      dates: [],
      types: [],
      statuses: [],
    });
    clearCheckedButNotAppliedOrderFilters();
    onQueryChanged({ onSearchAction: true });
  };
  return (
    <div className={'count-clear tag_dark_teal'}>
      <div className={'filter-count-wrapper'}>{children}</div>
      <span className="filter-clear-button" onClick={onClear}>
        <FilterClearIcon />
      </span>
    </div>
  );
};
export default OrderCountClear;