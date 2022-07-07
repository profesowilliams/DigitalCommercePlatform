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
import useFilteringSelected from "./hooks/useIsFilteringSelected";

import { RenewalErrorBoundary } from "./renewalErrorBoundary";

const FilterDialog = ({ children }) => {
  return <div className="filter-modal-container__popup">{children}</div>;
};

const FilterModal = ({ aemData, handleFilterCloseClick, onQueryChanged }) => {
  
  const {filterList, resetFilter, effects, filterData, _generateFilterFields} = useMultiFilterSelected();
  
  const appliedFilterCount = useRenewalGridState((state) => state.appliedFilterCount);
  
  const { setAppliedFilterCount } = useRenewalGridState((state) => state.effects);

  const {hasAnyFilterSelected, dateSelected} = useFilteringSelected()

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

    window.addEventListener('resize', updateWindowDimensions);

    const timeOutId = setTimeout(() => setFilterPanelDimensions(), 200);

    return () => {
      clearTimeout(timeOutId);
      window.removeEventListener('resize', updateWindowDimensions);
      document.querySelector("body").style.overflow = 'auto';
    }
  }, []);

  const setFilterPanelDimensions = () => {
    var popup = document.querySelector(".filter-modal-container .filter-modal-container__popup");
    var experiencefragment = document.querySelector(".experiencefragment.aem-GridColumn");
    var subheader = document.querySelector(".cmp-new-subheader");
    var modal = document.querySelector(".filter-modal-container");
    var close = document.querySelector(".btn-common.filter-modal-container__close");
    var body = document.querySelector("body");
    const headerMargin = 5;
    if (popup && experiencefragment && subheader && modal && close && body) {
      const pageHeaderHeight = experiencefragment.offsetHeight + subheader.offsetHeight + headerMargin -
        (experiencefragment.offsetHeight + subheader.offsetHeight >
        window.pageYOffset
          ? window.pageYOffset
          : experiencefragment.offsetHeight + subheader.offsetHeight);

      popup.style.top =
        experiencefragment.offsetHeight +
        subheader.offsetHeight +
        headerMargin +
        (window.pageYOffset -
          (experiencefragment.offsetHeight + subheader.offsetHeight >
          window.pageYOffset
            ? window.pageYOffset
            : experiencefragment.offsetHeight + subheader.offsetHeight)) +
        "px";
      
      popup.style.height = `calc(100vh - ${pageHeaderHeight}px)`;
      close.style.top =
        experiencefragment.offsetHeight +
        subheader.offsetHeight +
        headerMargin +
        (window.pageYOffset -
          (experiencefragment.offsetHeight + subheader.offsetHeight >
          window.pageYOffset
            ? window.pageYOffset
            : experiencefragment.offsetHeight + subheader.offsetHeight)) +
        "px";
      modal.style.height = (window.innerHeight + window.pageYOffset) + 'px';
      body.style.overflow = 'hidden';
    }
  }

  const root = filterList ? filterList[0] : false;
  const rootIds = root ? root.childIds : [];

  /**
   * Triggerred when the "show results" button is clicked on
   * Renewal filter.
   */
  const showResult = () => {
    const [optionFields] = _generateFilterFields();
    const queryString = JSON.stringify(optionFields);
    setAppliedFilterCount();
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

  const updateWindowDimensions = () => {
     setFilterPanelDimensions();
  };

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
          <div className="filter-accordion">
            <ul className="filter-accordion">
              <FilterList rootIds={rootIds} />
            </ul>
          </div>          
          <FilterTags />
          <Button btnClass="cmp-quote-button filter-modal-container__results" onClick={showResult} disabled={!hasAnyFilterSelected()}>
            {aemData.showResultLabel || 'Show Result'}
          </Button>
        </FilterDialog>
      </RenewalErrorBoundary>
    </div>
  );
};

export default FilterModal;
