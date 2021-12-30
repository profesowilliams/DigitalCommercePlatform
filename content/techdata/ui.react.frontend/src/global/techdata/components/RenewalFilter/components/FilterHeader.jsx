import React from "react";
import { useRenewalGridState } from "../../RenewalsGrid/store/RenewalsStore";
import Button from "../../Widgets/Button";

function FilterHeader() {
  const {filterList, effects} = useRenewalGridState();
  const {setFilterList} = effects;
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
