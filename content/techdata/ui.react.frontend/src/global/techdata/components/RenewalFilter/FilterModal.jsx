import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { FILTER_LOCAL_STORAGE_KEY } from "../../../../utils/constants";
import { pushEvent } from "../../../../utils/dataLayerUtils";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../RenewalsGrid/utils/renewalUtils";
import { getLocalValueOrDefault, useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";
import Button from "../Widgets/Button";
import FilterHeader from "./components/FilterHeader";
import FilterList from "./components/FilterList";
import FilterTags from "./components/FilterTags";
import useComputeBranding from "../../hooks/useComputeBranding";

import { generateFilterFields } from "./filterUtils/filterUtils";
import normaliseAPIData from "./filterUtils/normaliseAPIData";
import normaliseState from "./filterUtils/normaliseData";
import { useMultiFilterSelected } from "./hooks/useFilteringState";
import useFilteringSelected from "./hooks/useIsFilteringSelected";

import { RenewalErrorBoundary } from "./renewalErrorBoundary";
import { getDictionaryValue } from "../../../../utils/utils";

const FilterDialog = ({ children }) => {
  return <div className="filter-modal-container__popup">{children}</div>;
};

const FilterModal = ({ aemData, handleFilterCloseClick, onQueryChanged, topReference }) => {
  const {
    filterList,
    resetFilter,
    effects,
    filterData,
    _generateFilterFields,
  } = useMultiFilterSelected();

  const appliedFilterCount = useRenewalGridState(state => state.appliedFilterCount); 
  const isFilterModalOpen = useRenewalGridState( state => state.isFilterModalOpen);

  useEffect(() => {    
    const value = getLocalValueOrDefault(FILTER_LOCAL_STORAGE_KEY, "filterList", null)
    value && effects.setCustomState({key:'filterList',value});
  },[resetFilter, filterData, appliedFilterCount, isFilterModalOpen])

  const { computeClassName, isTDSynnex } = useComputeBranding(useRenewalGridState); 

  const { setAppliedFilterCount } = useRenewalGridState(
    (state) => state.effects
  );

  const { hasFilterChangeAvailable, dateSelected } = useFilteringSelected();

  const [DOMLoaded, setDOMLoaded] = useState(false);
  const customStartDate = useRenewalGridState(state => state.customStartDate);
  const customEndDate = useRenewalGridState(state => state.customEndDate);

  let aemFilterData;
  aemData.filterType =
    aemData.filterType === null ? "static" : aemData.filterType;

  if (aemData.filterType === "dynamic" && filterData?.refinements) {
    aemFilterData = normaliseAPIData(filterData.refinements);
  } else {
    aemFilterData = normaliseState(aemData.filterListValues);
  }

  const { setFilterList, toggleFilterModal, clearUnappliedDateRange, setCustomState, resetFilterToState } = effects;

  useEffect(() => {
    if (!filterList) {
      setFilterList(aemFilterData);
    }
  }, []);

  useEffect(() => {
    const onPageLoad = () => setDOMLoaded(true);
    if (!document.querySelector('.subheader')) return;
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  const root = filterList ? filterList[0] : false;
  const rootIds = root ? root.childIds : [];
  const filterDom = useRef();
  const filterBodyDom = useRef();  

  useEffect(() => {
    function dynamicFilterAdjustmnet() {
      const subHeaderElement = document.querySelector('.subheader > div > div');
      if (!subHeaderElement) return;
      const { top, height } = document.querySelector('.subheader > div > div').getBoundingClientRect();
      if ( top > 0 ) topReference.current = {top, height};
      const gap = 7;    
      let topCalculation = top + gap + height;
      if (dateSelected === 'custom' && topReference?.current){
        const {top, height} = topReference.current;
        topCalculation = top + gap + height;
        window.scrollTo(0, 0);
      }      
      filterDom.current.style.top = `${topCalculation}px`;
      filterDom.current.style.height = `calc(100vh - ${topCalculation}px)`;   
      filterBodyDom.current.style.height = `calc(100% - ${192}px)`;     
      document.body.style.overflow = "hidden";
    }
    const timer = setTimeout(dynamicFilterAdjustmnet, 0);
    window.addEventListener('scroll', dynamicFilterAdjustmnet);
    window.addEventListener('load', dynamicFilterAdjustmnet);
    return () => {
      document.body.style.overflow = "initial";
      clearTimeout(timer);
      window.removeEventListener('scroll', dynamicFilterAdjustmnet);
      window.removeEventListener('load', dynamicFilterAdjustmnet);
    };
  }, []);

  /**
   * Triggerred when the "show results" button is clicked on
   * Renewal filter.
   */
  const showResult = () => {
    const [optionFields] = _generateFilterFields();
    setAppliedFilterCount();
    const filtersCopy = [...filterList].map((filter, index) => {
      if (index !== 0) {
        const applied = filter.checked;
        return {...filter,applied};
      }
      return filter;
    });
    setFilterList(filtersCopy);
    setLocalStorageData(FILTER_LOCAL_STORAGE_KEY, {
      ...getLocalStorageData(FILTER_LOCAL_STORAGE_KEY),
      optionFields,
      dateSelected,
      customStartDate: dateSelected==='custom' ? customStartDate : null,
      customEndDate: dateSelected==='custom' ? customEndDate : null,
      filterList: filtersCopy,
    });
    toggleFilterModal();
    if (resetFilter)
      setCustomState({ key: "resetFilter", value: false });
    onQueryChanged();
    clearUnappliedDateRange();
  };

  const handleCloseModalClick = () => {
    resetFilterToState();
    handleFilterCloseClick();    
  };

  if (!filterList) return null;

  return DOMLoaded && 
    <>
      <div className="filter-modal-container" />
      <div className={computeClassName("filter-modal-content")} ref={filterDom}>
        <RenewalErrorBoundary>
          <Button
            onClick={handleCloseModalClick}
            btnClass={computeClassName("filter-modal-content__close")}
          />
          <FilterDialog>
            <FilterHeader onQueryChanged={onQueryChanged} />
            <div className="filter-modal-content__body" ref={filterBodyDom}>
              <div className={computeClassName("filter-accordion")} >
                <FilterList rootIds={rootIds} />
              </div>
              <div className="filter-modal-bottom">
                <FilterTags />
                <Button
                  btnClass={computeClassName("cmp-quote-button filter-modal-content__results")}
                  onClick={showResult}
                  disabled={!hasFilterChangeAvailable()}
                >
                  {getDictionaryValue("grids.common.label.filterSearch", "Show results")}
                </Button>
              </div>
            </div>
          </FilterDialog>
        </RenewalErrorBoundary>
      </div>
    </>
};

export default FilterModal;
