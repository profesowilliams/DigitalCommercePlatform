//import { useState, useEffect } from 'react';
//import { maxCounterCalculator, minCounterCalculator, } from '../../../../../utils/paginationUtil';
////import { updateQueryString } from '../utils/gridUtils';
//import { ANALYTIC_CONSTANTS, getPaginationAnalyticsGoogle, pushDataLayerGoogle, } from '../utils/analyticsUtils';

//function useOrderTrackingPaginationState({
//  onPageChange,
//  //onQueryChanged,
//  paginationData,
//  pageInputRef,
//  translations
//}) {
//  //const [paginationCounter, setPaginationCounter] = useState({
//  //  minCounter: 0,
//  //  maxCounter: 0,
//  //});

//  //const { totalCounter, currentResultsInPage, pageCount, pageNumber } =
//  //  paginationData;

//  //useEffect(() => updatePaginationCounter(), [pageNumber, totalCounter]);

  

//  const paginationHandlers = {
//    goToFirstPage,
//    incrementHandler,
//    decrementHandler,
//    gotToLastPage,
//    handleInputChange,
//    updatePaginationCounter,
//  };

//  const paginationStates = {
//    pageNumber,
//    pageInputRef,
//    pageCount,
//    totalCounter,
//  };

//  return {
//    paginationStates,
//    paginationHandlers,
//    processPaginationString,
//  };
//}

//export default useOrderTrackingPaginationState;