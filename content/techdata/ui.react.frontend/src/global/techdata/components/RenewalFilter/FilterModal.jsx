import React, { useCallback, useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import useGridFiltering from "../../hooks/useGridFiltering";
import { useRenewalGridState } from "../RenewalsGrid/store/RenewalsStore";
import Button from "../Widgets/Button";
import FilterHeader from "./components/FilterHeader";
import FilterList from "./components/FilterList";
import FilterTags from "./components/FilterTags";

import normaliseState from "./normaliseData";
import { RenewalErrorBoundary } from "./renewalErrorBoundary";

const FilterDialog = ({ children }) => {
  return <div className="filter-modal-container__popup">{children}</div>;
};

const FilterModal = ({ aemData, handleFilterCloseClick, queryChanged }) => {
  // https://beta.reactjs.org/learn/choosing-the-state-structure#avoid-deeply-nested-state
  const aemFilterData = normaliseState(aemData.filterListValues);
  const { filterList, effects } = useRenewalGridState();
  const { setFilterList, toggleFilterModal } = effects;

  useEffect(() => {
    if (!filterList) {
      setFilterList(aemFilterData);
    }
  }, []);

  const root = filterList ? filterList[0] : false;
  const rootIds = root ? root.childIds : [];

  const showResult = () => {
  
    const formatValue = name => name.replace(/\s/g, "").toLowerCase();
    const filteredResult = filterList.filter(
      (item) => !item.childIds.length && item.parentId && item.checked
    );
    const finalResult = filteredResult.map(
      (item) => `${item.field}=${formatValue(item.title)}`
    );
    const queryStringFinalFilter = '&'+finalResult.join("&");
    queryChanged({queryString:queryStringFinalFilter});
    toggleFilterModal();
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
          <FilterHeader />
          <ul className="filter-accordion">
            <FilterList rootIds={rootIds} />
          </ul>
          <FilterTags />
          <Button btnClass="cmp-quote-button filter-modal-container__results" onClick={showResult}>
            {aemData.showResultLabel}
          </Button>
        </FilterDialog>
      </RenewalErrorBoundary>
    </div>
  );
};

export default FilterModal;
