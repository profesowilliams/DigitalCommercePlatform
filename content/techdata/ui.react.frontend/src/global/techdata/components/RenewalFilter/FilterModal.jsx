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
import useIsTDSynnexClass from "./components/useIsTDSynnexClass";

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

  const { computeClassName, isTDSynnex } = useIsTDSynnexClass(); 

  const { setAppliedFilterCount } = useRenewalGridState(
    (state) => state.effects
  );

  const { hasAnyFilterSelected, dateSelected } = useFilteringSelected();

  const [DOMLoaded, setDOMLoaded] = useState(false);

  let aemFilterData;
  aemData.filterType =
    aemData.filterType === null ? "static" : aemData.filterType;

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

  useEffect(() => {
    const onPageLoad = () => setDOMLoaded(true);
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
      const { top } = filterDom.current.getBoundingClientRect();
      filterDom.current.style.height = `calc(100vh - ${top}px)`;   
      filterBodyDom.current.style.height = `calc(100% - ${192}px)`;     
      document.body.style.overflow = "hidden";
    }
    setTimeout(dynamicFilterAdjustmnet, 0);
    return () => (document.body.style.overflow = "initial");
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
      count: appliedFilterCount,
    });
    toggleFilterModal();
    if (resetFilter)
      effects.setCustomState({ key: "resetFilter", value: false });
    onQueryChanged();
  };

  

  if (!filterList) return null;

  function getFilterParent(){
    const newSubheader = document.querySelector("[data-component='NewSubheader']");
    const apjHeader = document.querySelector("#cmp-techdata-header");
    const subheaderDom = document.querySelector(".subheader");
    const aemAPJMainSubheader = subheaderDom?.hasChildNodes() ? subheaderDom.childNodes[0] : subheaderDom;    
    if (isTDSynnex && aemAPJMainSubheader) {
      aemAPJMainSubheader.style.position = 'relative';
      return aemAPJMainSubheader;
    } 
    return !!newSubheader ? newSubheader : (!!apjHeader ? apjHeader : document.body );
  }

  return DOMLoaded ? ReactDOM.createPortal(
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
    </>,
    getFilterParent()
  ) : <></>;
};

export default FilterModal;
