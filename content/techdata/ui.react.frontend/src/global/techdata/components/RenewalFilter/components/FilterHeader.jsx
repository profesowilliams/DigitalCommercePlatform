import React from "react";
import { FILTER_LOCAL_STORAGE_KEY, PAGINATION_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import Button from "../../Widgets/Button";

function FilterHeader({ onQueryChanged }) {
  const filterList = useRenewalGridState(state => state.filterList);
  const paginationData = useRenewalGridState(state => state.pagination);
  const effects = useRenewalGridState(state => state.effects);
  const {setFilterList, clearDateFilters, toggleFilterModal, setAppliedFilterCount} = effects;
  const handleClearFilter = () => {
    const filtersCopy = [...filterList].map((filter, index) => {
      if (index !== 0) {
        const open = false;
        const checked = false;
        return {...filter,open,checked};
      }
      return filter;
    });
    setFilterList(filtersCopy);
    clearDateFilters();
    toggleFilterModal();
    onQueryChanged({reset:true});
    setAppliedFilterCount();
    effects.setCustomState(
      { key: "pagination", value: { ...paginationData, pageNumber: 1 } },
      {
        key: PAGINATION_LOCAL_STORAGE_KEY,
        saveToLocal: true,
      }
    );
    localStorage.removeItem(FILTER_LOCAL_STORAGE_KEY);
  };
  return (
    <div className="filter-modal-container__header">
      <h3>Filters</h3>
      <Button
        onClick={handleClearFilter}
        btnClass="filter-modal-container__header--clear-all"
      >
        Clear all filters
      </Button>
    </div>
  );
}
export default FilterHeader;
