import React, { useState } from "react";
import FilterModal from "./FilterModal";
import Button from "../Widgets/Button";
import { useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";

export default function RenewalFilter({ aemData, queryChanged }) {
  
  const isFilterModalOpen = useRenewalGridState(state => state.isFilterModalOpen);
  const effects = useRenewalGridState(state => state.effects);
  const {toggleFilterModal} = effects;
  console.log("render ❓❓");
  const handleFilterClick = () => {
    toggleFilterModal();
  };

  const handleFilterCloseClick = () => {
    toggleFilterModal({justClose:true});
  };

  return (
    <div>
      <div className="cmp-renewals-filter-container">
      <Button btnClass="cmp-renewals-filter__button" onClick={handleFilterClick}>
        Filter
      </Button>
      <i className="fas fa-sliders-h"></i>
      </div>
      {isFilterModalOpen && (
        <FilterModal
          aemData={aemData}
          queryChanged={queryChanged}
          handleFilterCloseClick={handleFilterCloseClick}
        />
      )}
    </div>
  );
}
