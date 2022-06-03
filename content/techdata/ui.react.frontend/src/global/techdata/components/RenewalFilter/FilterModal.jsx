import React, { useEffect } from "react";
import { FILTER_LOCAL_STORAGE_KEY } from "../../../../utils/constants";
import { pushEvent } from "../../../../utils/dataLayerUtils";
import { getLocalStorageData, setLocalStorageData } from "../RenewalsGrid/renewalUtils";
import { useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";
import Button from "../Widgets/Button";
import FilterHeader from "./components/FilterHeader";
import FilterList from "./components/FilterList";
import FilterTags from "./components/FilterTags";

import { generateFilterFields } from "./filterUtils/filterUtils";
import normaliseAPIData from "./filterUtils/normaliseAPIData";
import normaliseState from "./filterUtils/normaliseData";
import { useMultiFilterSelected } from "./hooks/useFilteringState";

import { RenewalErrorBoundary } from "./renewalErrorBoundary";

const FilterDialog = ({ children }) => {
  return <div className="filter-modal-container__popup">{children}</div>;
};

const FilterModal = ({ aemData, handleFilterCloseClick, onQueryChanged }) => {
  
  const {filterList, resetFilter, effects, filterData, _generateFilterFields} = useMultiFilterSelected();
  const dateSelected = useRenewalGridState((state) => state.dateSelected);
  const appliedFilterCount = useRenewalGridState((state) => state.appliedFilterCount);

  let aemFilterData;
  aemData.filterType = aemData.filterType === null ? "static" : aemData.filterType;
  
  if (aemData.filterType === "dynamic") {
    aemFilterData = normaliseAPIData(filterData.refinements);
  } else {
    aemFilterData = normaliseState(aemData.filterListValues);
  }

  const { setFilterList, toggleFilterModal } = effects;

  useEffect(() => {
    if (!filterList) {
      setFilterList(aemFilterData);
    }
  }, []);

  const root = filterList ? filterList[0] : false;
  const rootIds = root ? root.childIds : [];

  /**
   * Triggerred when the "show results" button is clicked on
   * Renewal filter.
   */
  const showResult = () => {
    const [optionFields] = _generateFilterFields();
    const queryString = JSON.stringify(optionFields);
    setLocalStorageData(FILTER_LOCAL_STORAGE_KEY, {
      ...getLocalStorageData(FILTER_LOCAL_STORAGE_KEY),
      optionFields,
      dateSelected,
      filterList,
      count: appliedFilterCount,
    });
    toggleFilterModal();
    if (resetFilter) effects.setCustomState({key:'resetFilter', value: false});
    onQueryChanged();
  }

  if (!filterList) return null;
  
  return (
    <div className="filter-modal-container">
      <RenewalErrorBoundary>
        <Button
          onClick={handleFilterCloseClick}
          btnClass="filter-modal-container__close"
        ></Button>
        <FilterDialog>
          <FilterHeader onQueryChanged={onQueryChanged}/>
          <ul className="filter-accordion">
            <FilterList rootIds={rootIds} />
          </ul>
          <FilterTags />
          <Button btnClass="cmp-quote-button filter-modal-container__results" onClick={showResult}>
            {aemData.showResultLabel || 'Show Result'}
          </Button>
        </FilterDialog>
      </RenewalErrorBoundary>
    </div>
  );
};

export default FilterModal;
