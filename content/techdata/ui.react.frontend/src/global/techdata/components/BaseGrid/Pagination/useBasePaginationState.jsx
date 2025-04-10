import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import { PAGINATION_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import { maxCounterCalculator, minCounterCalculator } from '../../../../../utils/paginationUtil';
import { getDictionaryValue } from '../../../../../utils/utils';
import { updateQueryString } from '../../RenewalsGrid/utils/renewalUtils';
import { pushDataLayer, getPaginationAnalytics, ANALYTIC_CONSTANTS } from '../../Analytics/analytics';

//store can either be renewalsStore or ordertrackingStore
function useBasePaginationState({ store, onQueryChanged }) {
  const [paginationCounter, setPaginationCounter] = useState({
    minCounter: 0,
    maxCounter: 0,
  });  
  const pageInputRef = useRef();
  const paginationData = store(st => st.pagination);
  const effects = store(st => st.effects);
  const analyticsCategory = store(st => st.analyticsCategory);

  const {
    totalCounter,
    currentResultsInPage,
    pageCount,
    pageNumber,
  } = paginationData;
  
  useEffect(()=>updatePaginationCounter(),[pageNumber]);

  const { setCustomState, closeAndCleanToaster } = effects;
  
  const maxPaginationCounter = () =>
    maxCounterCalculator(currentResultsInPage, pageNumber, paginationData);

  const minPaginationCounter = () =>
    minCounterCalculator(currentResultsInPage, pageNumber);

  function updatePaginationCounter (){
    setPaginationCounter({
      minCounter: minPaginationCounter(),
      maxCounter: maxPaginationCounter(),
    });   
  };   
  
  const paginationGetTotalPages = () =>
    pageCount ?? Math.ceil(currentResultsInPage / totalCounter);

  const sendPagingRequest = () => onQueryChanged();  

  const goToFirstPage = () => goToSpecificPage(0)

  const gotToLastPage = () =>  goToSpecificPage(pageCount-1)

   /**
   * The useImperativeHandle hook exposes the paginationData state to external references, 
   * enabling the custom interceptor to make the proper request to the service on changes. 
   */
  function saveAndUpdatePagination (value) {   
    setCustomState({ key: "pagination", value },  {
      key: PAGINATION_LOCAL_STORAGE_KEY,
      saveToLocal: true,
    });
    sendPagingRequest();
    updateQueryString(value?.pageNumber);
    closeAndCleanToaster && closeAndCleanToaster();
  }

  const incrementHandler = () => {
    if (pageNumber > pageCount - 1) return;
    const value = { ...paginationData, pageNumber:pageNumber+1 };
    saveAndUpdatePagination(value);   
  };

  const decrementHandler = () => {    
    if (pageNumber-1 <= 0) return;
    const value = { ...paginationData, pageNumber:pageNumber-1 };
    saveAndUpdatePagination(value);           
  };

  const goToSpecificPage = (specificNumber) => {
    const value = { ...paginationData, pageNumber: specificNumber + 1 };
    saveAndUpdatePagination(value);   
  }

  const handleInputBlur = ({ target }) => {
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10))
      return;
    pushDataLayer(getPaginationAnalytics(analyticsCategory, ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageNo, value.pageNumber));
    goToSpecificPage(value);    
  };

  const goOnTwoDigits = ({ target }) => {
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10))
      return;
    if (target.value.length >= 3) {
      pushDataLayer(getPaginationAnalytics(analyticsCategory, ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageNo, value.pageNumber));
      goToSpecificPage(value);
      pageInputRef.current.blur();
    }
  };

  const triggerSearchOnEnter = (event) => {
    const { target } = event;
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10))
      return;
    if (event.keyCode === 13) {
      goToSpecificPage(value);
      pageInputRef.current.blur();
      
    }
  };

/**
 * Get the upper limit of items shown based on pagination counters and total count.
 * 
 * @returns {number} The upper limit of items to be shown, or 0 if there are no items.
 */
const getUpperLimitShownItemsNumber = () => {
  // Retrieve the maximum possible pagination counter value
  const maxCounter = maxPaginationCounter();
  let upperLimit;

  // Determine the upper limit based on the current pagination counter
  if (paginationCounter.maxCounter > 0 && paginationCounter.maxCounter < maxCounter) {
    // If the current pagination counter is positive but less than the maximum, use the maximum
    upperLimit = maxCounter;
  } else {
    // Otherwise, use the current pagination counter if positive, or the maximum counter
    upperLimit = paginationCounter.maxCounter > 0 ? paginationCounter.maxCounter : maxCounter;
  }

  // Ensure the upper limit does not exceed the total number of items
  if (upperLimit > totalCounter) {
    upperLimit = totalCounter;
  }

  // Return the upper limit if there are items to display, otherwise return 0
  return totalCounter ? upperLimit : 0;
}

  const getPaginationMinCounter = () => {
    return paginationCounter.minCounter > 0
    ? paginationCounter.minCounter
    : minPaginationCounter();
  }

  const processPaginationString = () => {
    const dictionaryLabel = getDictionaryValue("grids.common.label.results", "{0}-{1} of {2} results");
    const labelWithResults = dictionaryLabel.replace("{0}", getPaginationMinCounter())?.replace("{1}", getUpperLimitShownItemsNumber())?.replace("{2}", totalCounter || '');    
    const defaultString = `0 ${dictionaryLabel?.split(" ")?.pop()}`;
    return totalCounter ? labelWithResults : defaultString;
  }

  const handleInputchange = (event) => {
    switch (event?.type) {
      case 'change':
        goOnTwoDigits(event);
        break;
      case 'blur':
        handleInputBlur(event);
        break;
      case 'keydown':
        triggerSearchOnEnter(event);
        break;
      default:
        break;
    }
  }

  const paginationHandlers = {goToFirstPage, incrementHandler, decrementHandler, gotToLastPage, handleInputchange};
  const paginationStates = {pageNumber, pageInputRef, pageCount};

  return { paginationStates, paginationHandlers, processPaginationString, analyticsCategory };
}

export default useBasePaginationState;
