import React, { useState } from "react";
import FilterModal from "./FilterModal";
import Button from "../Widgets/Button";
import { useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";

export default function RenewalFilter({ aemData, onQueryChanged }) {
  
  const isFilterModalOpen = useRenewalGridState(state => state.isFilterModalOpen);
  const effects = useRenewalGridState(state => state.effects);
  const {toggleFilterModal} = effects;
  const handleFilterClick = () => {
    toggleFilterModal();
  };

  const handleFilterCloseClick = () => {
    toggleFilterModal({justClose:true});
  };

  return (
    <div className="cmp-renewal-filter">
      <div className="cmp-renewals-filter-container" onClick={handleFilterClick}>
      <Button btnClass="cmp-renewals-filter__button">
        Filter
      </Button>
      <i className="fas fa-sliders-h"></i>
      </div>
      {isFilterModalOpen && (
        <FilterModal
          aemData={aemData}        
          handleFilterCloseClick={handleFilterCloseClick}
          onQueryChanged={onQueryChanged}
        />
      )}
    </div>
  );
}
