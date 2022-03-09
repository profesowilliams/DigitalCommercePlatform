import React from "react";
import FilterModal from "./FilterModal";
import Button from "../Widgets/Button";
import { useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";
import { pushEvent } from "../../../../utils/dataLayerUtils";
import Count from "./components/Count";

export default function RenewalFilter({ aemData, onQueryChanged }) {
  const isFilterModalOpen = useRenewalGridState(
    (state) => state.isFilterModalOpen
  );
  const appliedFilterCount = useRenewalGridState(state => state.appliedFilterCount);
  const effects = useRenewalGridState((state) => state.effects);
  const { toggleFilterModal } = effects;

  const handleFilterClick = () => {
    pushEvent("click", {
      type: "button",
      category: "Renewals Table Interactions",
      name: "Filter Icon",
    });
    toggleFilterModal();
  };

  const handleFilterCloseClick = () => {
    toggleFilterModal({ justClose: true });
  };

  return (
    <div className="cmp-renewal-filter">
      <div
        className="cmp-renewals-filter-container"
        onClick={handleFilterClick}
      >
        {appliedFilterCount !== 0 && <Count>{appliedFilterCount}</Count>}
        <Button btnClass="cmp-renewals-filter__button">Filter</Button>
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
