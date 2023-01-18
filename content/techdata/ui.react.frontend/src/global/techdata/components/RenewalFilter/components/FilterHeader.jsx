import React from "react";
import { FILTER_LOCAL_STORAGE_KEY, PAGINATION_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import { getDictionaryValue } from "../../../../../utils/utils";
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
        const applied = false;
        return {...filter,open,checked,applied};
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
    <div className="filter-modal-content__header">
      <h3>{getDictionaryValue("grids.common.label.filterTitle", "Filters")}</h3>
      <Button
        onClick={handleClearFilter}
        btnClass="filter-modal-content__header--clear-all"
      >
        {getDictionaryValue("grids.common.label.clearAllFilters", "Clear all filters")}
      </Button>
    </div>
  );
}
export default FilterHeader;
