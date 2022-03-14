import React, { useMemo, useState, useEffect, useRef } from "react";
import { useCallback } from "react";
import {   maxCounterCalculator,
    minCounterCalculator, pageCalculator } from "../../../../utils/paginationUtil";
import { useRenewalGridState } from "./store/RenewalsStore";

function CustomRenewalPagination() {
  const paginationData = useRenewalGridState(state => state.pagination);
  const gridApi = useRenewalGridState(state => state.gridApi);
  const setPaginationData = useRenewalGridState(state => state.effects.setCustomState);
  const [paginationCounter, setPaginationCounter] = useState({ minCounter: 0, maxCounter: 0 });
  const pageInputRef = useRef();

  const { totalCounter, stepBy, currentPage, currentResultsInPage, pageCount, pageNumber } =
  paginationData;
  if (!gridApi) return null
  if (!(Object.keys(gridApi).length)) return null
  
  const paginationGetTotalPages = () => (pageCount ?? Math.ceil(currentResultsInPage / totalCounter)); 

  const maxPaginationCounter = () => maxCounterCalculator(currentResultsInPage, getCurrentPage());
    
  const minPaginationCounter =  () => 
  minCounterCalculator(
    getCurrentPage(),
    currentResultsInPage,       
  );

  const getCurrentPage = () => gridApi?.paginationGetCurrentPage() + 1;

    const incrementHandler = () => {
      const value = {
        ...paginationData,    
      }
        setPaginationData({key:'pagination',value});
        gridApi?.paginationGoToNextPage();
        updatePaginationCounter();
    };

  const decrementHandler = () => {
    const value = {
      ...paginationData,    
    }
    setPaginationData({key:'pagination',value});
    gridApi?.paginationGoToPreviousPage();
    updatePaginationCounter();
  };

  const goToSpecificPage = value => gridApi?.paginationGoToPage(value);

  const updatePaginationCounter = () => {
    setPaginationCounter({
      minCounter: minPaginationCounter(),
      maxCounter: maxPaginationCounter(),
    });
    gridApi?.refreshServerSideStore();
  }

  const handleInputBlur = ({target}) => {
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(),10)) return;
    goToSpecificPage(value);
    updatePaginationCounter();
  }

  const goOnTwoDigits = ({target}) => {
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(),10)) return;
    if (target.value.length >= 3){
      goToSpecificPage(value);
      pageInputRef.current.blur();
    } 
  }

  const triggerSearchOnEnter = (event) => {
    const {target} = event;
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(),10)) return;
    if(event.keyCode === 13){
      goToSpecificPage(value);
      pageInputRef.current.blur();
      updatePaginationCounter();
    }
  }

  return (
    <div className="cmp-navigation">
      <p className="navigation__info"> 
        {paginationCounter.minCounter > 0 ? paginationCounter.minCounter : minPaginationCounter()}-{paginationCounter.maxCounter > 0 ? paginationCounter.maxCounter : maxPaginationCounter()} of {totalCounter} results
      </p>
      <p className="cmp-navigation__actions">
        <button style={{cursor:getCurrentPage() !== 1 && 'pointer'}} disabled={getCurrentPage() === 1} onClick={decrementHandler}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="cmp-navigation__actions-labels">
          <input ref={pageInputRef} type="number" onKeyDown={triggerSearchOnEnter} onChange={goOnTwoDigits} onBlur={handleInputBlur} defaultValue={getCurrentPage()} key={Math.random()} />
          <span>of</span>
          <span>{paginationGetTotalPages() }</span>         
        </div>
        <button disabled={getCurrentPage() === pageCount} onClick={incrementHandler} style={{cursor:getCurrentPage() !== pageCount && 'pointer'}}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </p>
    </div>
  );
}

export default CustomRenewalPagination;
