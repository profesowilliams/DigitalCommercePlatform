import React, { useMemo, useState, useEffect } from "react";
import { useCallback } from "react";
import {   maxCounterCalculator,
    minCounterCalculator, pageCalculator } from "../../../../utils/paginationUtil";
import { useRenewalGridState } from "./store/RenewalsStore";

function CustomRenewalPagination() {
  const paginationData = useRenewalGridState(state => state.pagination);
  const gridApi = useRenewalGridState(state => state.gridApi);
  const setPaginationData = useRenewalGridState(state => state.effects.setCustomState);

  const { totalCounter, stepBy, currentPage, currentResultsInPage, pageCount, pageNumber } =
  paginationData;
  
  const paginationGetTotalPages = () => (pageCount ?? Math.ceil(currentResultsInPage / totalCounter)); 

  const maxPaginationCounter = () => maxCounterCalculator(currentResultsInPage, getCurrentPage());
    
  const minPaginationCounter =  () => 
  minCounterCalculator(
    getCurrentPage(),
    currentResultsInPage,       
  );

  const getCurrentPage = () => gridApi?.api?.paginationGetCurrentPage() + 1;

    const incrementHandler = () => {
      const value = {
        ...paginationData,    
      }
        setPaginationData({key:'pagination',value});
        gridApi.api.paginationGoToNextPage();
    };

  const decrementHandler = () => {
    const value = {
      ...paginationData,    
    }
    setPaginationData({key:'pagination',value});
    gridApi.api.paginationGoToPreviousPage();
  };

  return (
    <div className="cmp-navigation">
      <p className="navigation__info"> 
        {minPaginationCounter()}-{maxPaginationCounter()} of {totalCounter} results
      </p>
      <p className="cmp-navigation__actions">
        <button disabled={currentPage === 1} onClick={decrementHandler}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="cmp-navigation__actions-labels">
          <span className="currentPage">{getCurrentPage()}</span>
          <span>of</span>
          <span>{paginationGetTotalPages() }</span>         
        </div>
        <button onClick={incrementHandler}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </p>
    </div>
  );
}

export default CustomRenewalPagination;
