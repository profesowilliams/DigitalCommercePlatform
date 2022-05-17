import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import Button from "../../Widgets/Button";

function FilterHeader({ onQueryChanged }) {
  const filterList = useRenewalGridState(state => state.filterList);
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
