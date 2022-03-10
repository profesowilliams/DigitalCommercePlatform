import React, { useEffect } from "react";
import { pushEvent } from "../../../../utils/dataLayerUtils";
import { useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";
import Button from "../Widgets/Button";
import FilterHeader from "./components/FilterHeader";
import FilterList from "./components/FilterList";
import FilterTags from "./components/FilterTags";

import { generateFilterFields } from "./filterUtils/filterUtils";
import normaliseAPIData from "./filterUtils/normaliseAPIData";
import normaliseState from "./filterUtils/normaliseData";

import { RenewalErrorBoundary } from "./renewalErrorBoundary";

const FilterDialog = ({ children }) => {
  return <div className="filter-modal-container__popup">{children}</div>;
};

const FilterModal = ({ aemData, handleFilterCloseClick, onQueryChanged }) => {
  const filterData = useRenewalGridState(state => state.refinements);

  let aemFilterData;
  aemData.filterType = aemData.filterType === null ? "static" : aemData.filterType;
  
  if (aemData.filterType === "dynamic") {
    aemFilterData = normaliseAPIData(filterData.refinements);
  } else {
    aemFilterData = normaliseState(aemData.filterListValues);
  }

  const filterList = useRenewalGridState(state => state.filterList);
  const dateSelected = useRenewalGridState(state => state.dateSelected);
  const datePickerState = useRenewalGridState(state => state.datePickerState);
  const resetFilter = useRenewalGridState(state => state.resetFilter);
  const effects = useRenewalGridState(state => state.effects);

  const { setFilterList, toggleFilterModal } = effects;

  useEffect(() => {
    if (!filterList) {
      setFilterList(aemFilterData);
    }
  }, []);

  const root = filterList ? filterList[0] : false;
  const rootIds = root ? root.childIds : [];

  const showResult = () => {
    const optionFields = generateFilterFields(filterList, dateSelected, datePickerState);
    const queryString = JSON.stringify(optionFields);
    toggleFilterModal();
    if (resetFilter){
      onQueryChanged();
      effects.setCustomState({key:'resetFilter', value: false});
      return;
    }
    onQueryChanged({queryString},{filterStrategy:'post'});
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
