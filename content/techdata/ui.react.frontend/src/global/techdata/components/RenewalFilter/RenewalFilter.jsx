import React from "react";
import FilterModal from "./FilterModal";
import Button from "../Widgets/Button";
import { useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";
import { pushEvent, ANALYTICS_TYPES } from "../../../../utils/dataLayerUtils";
import Count from "./components/Count";
import { TOASTER_LOCAL_STORAGE_KEY } from "../../../../utils/constants";


export default function RenewalFilter({ aemData, onQueryChanged }) {
  const isFilterModalOpen = useRenewalGridState(
    (state) => state.isFilterModalOpen
  );
  const effects = useRenewalGridState((state) => state.effects);
  const appliedFilterCount = useRenewalGridState(state => state.appliedFilterCount);

  const { toggleFilterModal } = effects;
  const handleFilterClick = () => {
    pushEvent(ANALYTICS_TYPES.events.click, {
      type: ANALYTICS_TYPES.types.button,
      category: ANALYTICS_TYPES.category.renewalsTableInteraction,
      name: ANALYTICS_TYPES.name.filterIcon,
    });
    toggleFilterModal();
    window.scrollTo(0,0);
    const options = { key: TOASTER_LOCAL_STORAGE_KEY, clearLocal: true };
    effects.setCustomState({key:'toaster', value:{isOpen:false}},options);
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
