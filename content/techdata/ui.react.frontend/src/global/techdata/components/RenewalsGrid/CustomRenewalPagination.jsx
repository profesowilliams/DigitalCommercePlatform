import React, { useMemo, useState, useEffect, useRef } from "react";
import { useCallback } from "react";
import {   maxCounterCalculator,
    minCounterCalculator, pageCalculator } from "../../../../utils/paginationUtil";
import { useRenewalGridState } from "./store/RenewalsStore";

function CustomRenewalPagination() {
  const paginationData = useRenewalGridState(state => state.pagination);
  const paginationGridApi = useRenewalGridState(state => state.paginationGridApi);
  const setPaginationData = useRenewalGridState(state => state.effects.setCustomState);
  const pageInputRef = useRef();

  const { totalCounter, stepBy, currentPage, currentResultsInPage, pageCount, pageNumber } =
  paginationData;
  if (!paginationGridApi) return null
  if (!(Object.keys(paginationGridApi).length)) return null
  
  const paginationGetTotalPages = () => (pageCount ?? Math.ceil(currentResultsInPage / totalCounter)); 

  const maxPaginationCounter = () => maxCounterCalculator(currentResultsInPage, getCurrentPage());
    
  const minPaginationCounter =  () => 
  minCounterCalculator(
    getCurrentPage(),
    currentResultsInPage,       
  );

  const getCurrentPage = () => paginationGridApi?.paginationGetCurrentPage() + 1;

    const incrementHandler = () => {
      const value = {
        ...paginationData,    
      }
        setPaginationData({key:'pagination',value});
        paginationGridApi?.paginationGoToNextPage();
    };

  const decrementHandler = () => {
    const value = {
      ...paginationData,    
    }
    setPaginationData({key:'pagination',value});
    paginationGridApi?.paginationGoToPreviousPage();
  };

  const goToSpecificPage = value => paginationGridApi?.paginationGoToPage(value);

  const handleInputBlur = ({target}) => {
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(),10)) return;
    goToSpecificPage(value);
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
    }
  }

  return (
    <div className="cmp-navigation">
      <p className="navigation__info"> 
        {minPaginationCounter()}-{maxPaginationCounter()} of {totalCounter} results
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
