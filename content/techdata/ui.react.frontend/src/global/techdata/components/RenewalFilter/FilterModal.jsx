import React, { useCallback, useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { addDays } from "../../helpers/formatting";
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

const FilterModal = ({ aemData, handleFilterCloseClick, onQueryChanged }) => {
  // https://beta.reactjs.org/learn/choosing-the-state-structure#avoid-deeply-nested-state
  const aemFilterData = normaliseState(aemData.filterListValues);  
  const filterList = useRenewalGridState(state => state.filterList);
  const dateSelected = useRenewalGridState(state => state.dateSelected);
  const datePickerState = useRenewalGridState(state => state.datePickerState);


  
  const effects = useRenewalGridState(state => state.effects);
  const { setFilterList, toggleFilterModal } = effects;

  useEffect(() => {
    if (!filterList) {
      setFilterList(aemFilterData);
    }
  }, []);

  const root = filterList ? filterList[0] : false;
  const rootIds = root ? root.childIds : [];
  const [startRangeDate,endRangeDate] = datePickerState || [new Date(), new Date()];
  const mappedOptionsDate = {
    'today': [new Date()],
    '30': [new Date(), addDays(30)],
    '60': [addDays(31), addDays(60)],
    '90': [addDays(61), addDays(90)],
    '91': [addDays(90)],
    'custom': [startRangeDate,endRangeDate],  
  }

  
  const showResult = () => {
  
    const formatValue = name => name.replace(/\s/g, "").toLowerCase();
    const filteredResult = filterList.filter(
      (item) => !item.childIds.length && item.parentId && item.checked
    );    
    const uniqueFieldList = [... new Set(filteredResult.map(item =>item.field))];
    function mapMultipleValues(uniqueField){
      let list = [];      
      for (let {field, title} of filteredResult){
        if(field === uniqueField) list.push(title)
      }
      return list;
    }    
    const POSTDATA = uniqueFieldList.reduce((ac,field) => ({...ac,[field]:mapMultipleValues(field)}),{})
    function mapToObject(dateList = []){
      const [DueDateFrom,DueDateTo] = dateList;      
      if (DueDateFrom,DueDateTo) return {DueDateFrom,DueDateTo}
      if (!DueDateFrom) return {DueDateTo}
      if (!DueDateTo) return {DueDateFrom}
    }
    const postDataWithDate = {...POSTDATA, ...mapToObject(mappedOptionsDate[dateSelected])};
    const queryString = JSON.stringify(postDataWithDate);
    onQueryChanged({queryString},{filterStrategy:'post'});
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
            {aemData.showResultLabel || 'Show Result'}
          </Button>
        </FilterDialog>
      </RenewalErrorBoundary>
    </div>
  );
};

export default FilterModal;
