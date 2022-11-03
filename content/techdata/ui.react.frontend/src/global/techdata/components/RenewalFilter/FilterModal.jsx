import React, { useEffect, useState } from "react";
import { useRef } from "react";
import ReactDOM from "react-dom";
import { FILTER_LOCAL_STORAGE_KEY } from "../../../../utils/constants";
import { pushEvent } from "../../../../utils/dataLayerUtils";
import {
  getLocalStorageData,
  setLocalStorageData,
} from "../RenewalsGrid/renewalUtils";
import { useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";
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

const FilterDialog = ({ children }) => {
  return <div className="filter-modal-container__popup">{children}</div>;
};

const FilterModal = ({ aemData, handleFilterCloseClick, onQueryChanged }) => {
  const {
    filterList,
    resetFilter,
    effects,
    filterData,
    _generateFilterFields,
  } = useMultiFilterSelected();

  const appliedFilterCount = useRenewalGridState(
    (state) => state.appliedFilterCount
  );

  const { computeClassName, isTDSynnex } = useComputeBranding(useRenewalGridState); 

  const { setAppliedFilterCount } = useRenewalGridState(
    (state) => state.effects
  );

  const { hasAnyFilterSelected, dateSelected } = useFilteringSelected();

  const [DOMLoaded, setDOMLoaded] = useState(false);

  let aemFilterData;
  aemData.filterType =
    aemData.filterType === null ? "static" : aemData.filterType;

  if (aemData.filterType === "dynamic" && filterData?.refinements) {
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
      const gap = 7;
      const topCalculation = top + gap + height;
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
    setLocalStorageData(FILTER_LOCAL_STORAGE_KEY, {
      ...getLocalStorageData(FILTER_LOCAL_STORAGE_KEY),
      optionFields,
      dateSelected,
      filterList,
    });
    toggleFilterModal();
    if (resetFilter)
      effects.setCustomState({ key: "resetFilter", value: false });
    onQueryChanged();
    effects.clearDateSelectionOnRangeClear();
  };

  

  if (!filterList) return null;

  function getFilterParent(){
    const newSubheader = document.querySelector("[data-component='NewSubheader']");
    const apjHeader = document.querySelector("#cmp-techdata-header");
    const subheaderDom = document.querySelector(".cmp-sub-header--sub-nav.new-sub");
    const aemAPJMainSubheader = subheaderDom || apjHeader;    
    if (isTDSynnex && aemAPJMainSubheader) {
      aemAPJMainSubheader.style.position = 'relative';
      return aemAPJMainSubheader;
    } 
    return !!newSubheader ? newSubheader : (!!apjHeader ? apjHeader : document.body );
  }

  return DOMLoaded && 
    <>
      <div className="filter-modal-container" />
      <div className={computeClassName("filter-modal-content")} ref={filterDom}>
        <RenewalErrorBoundary>
          <Button
            onClick={handleFilterCloseClick}
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
                  disabled={!hasAnyFilterSelected()}
                >
                  {aemData.showResultLabel || "Show Results"}
                </Button>
              </div>
            </div>
          </FilterDialog>
        </RenewalErrorBoundary>
      </div>
    </>
};

export default FilterModal;
