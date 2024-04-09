import React, { useState, useEffect, useRef } from 'react';
import { ORDER_PAGINATION_LOCAL_STORAGE_KEY } from '../../../../../utils/constants';
import {
  maxCounterCalculator,
  minCounterCalculator,
} from '../../../../../utils/paginationUtil';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import { updateQueryString } from '../utils/gridUtils';
import {
  ANALYTIC_CONSTANTS,
  getPaginationAnalyticsGoogle,
  pushDataLayerGoogle,
} from '../utils/analyticsUtils';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';

function useOrderTrackingPaginationState({
  onQueryChanged,
  resultsLabel,
  ofLabel,
}) {
  const [paginationCounter, setPaginationCounter] = useState({
    minCounter: 0,
    maxCounter: 0,
  });
  const pageInputRef = useRef();
  const paginationData = useOrderTrackingStore((st) => st.pagination);
  const effects = useOrderTrackingStore((st) => st.effects);

  const { totalCounter, currentResultsInPage, pageCount, pageNumber } =
    paginationData;

  useEffect(() => updatePaginationCounter(), [pageNumber]);

  const { setCustomState, closeAndCleanToaster } = effects;

  const maxPaginationCounter = () =>
    maxCounterCalculator(currentResultsInPage, pageNumber, paginationData);

  const minPaginationCounter = () =>
    minCounterCalculator(currentResultsInPage, pageNumber);

  function updatePaginationCounter() {
    setPaginationCounter({
      minCounter: minPaginationCounter(),
      maxCounter: maxPaginationCounter(),
    });
  }

  const paginationGetTotalPages = () =>
    pageCount ?? Math.ceil(currentResultsInPage / totalCounter);

  const sendPagingRequest = () => onQueryChanged();

  const goToFirstPage = () => goToSpecificPage(0);

  const gotToLastPage = () => goToSpecificPage(pageCount - 1);

  /**
   * The useImperativeHandle hook exposes the paginationData state to external references,
   * enabling the custom interceptor to make the proper request to the service on changes.
   */
  function saveAndUpdatePagination(value) {
    setCustomState(
      { key: 'pagination', value },
      {
        key: ORDER_PAGINATION_LOCAL_STORAGE_KEY,
        saveToLocal: true,
      }
    );
    sendPagingRequest();
    updateQueryString(value?.pageNumber);
    closeAndCleanToaster && closeAndCleanToaster();
  }

  const incrementHandler = () => {
    if (pageNumber > pageCount - 1) return;
    const value = { ...paginationData, pageNumber: pageNumber + 1 };
    saveAndUpdatePagination(value);
  };

  const decrementHandler = () => {
    if (pageNumber - 1 <= 0) return;
    const value = { ...paginationData, pageNumber: pageNumber - 1 };
    saveAndUpdatePagination(value);
  };

  const goToSpecificPage = (specificNumber) => {
    const value = { ...paginationData, pageNumber: specificNumber + 1 };
    saveAndUpdatePagination(value);
  };

  const handleInputBlur = ({ target }) => {
    let value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10)) {
      value = parseInt(paginationGetTotalPages(), 10) - 1;
    }
    pushDataLayerGoogle(
      getPaginationAnalyticsGoogle(
        ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageNo,
        value+1
      )
    );
    goToSpecificPage(value);
  };

  const goOnTwoDigits = ({ target }) => {
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10))
      return;
    if (target.value.length >= 3) {
      pushDataLayerGoogle(
        getPaginationAnalyticsGoogle(
          ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageNo,
          value+1
        )
      );
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

  const getUpperLimitShownItemsNumber = () => {
    const upperLimit =
      paginationCounter.maxCounter > 0
        ? paginationCounter.maxCounter
        : maxPaginationCounter();
    return totalCounter ? upperLimit : 0;
  };

  const getPaginationMinCounter = () => {
    return paginationCounter.minCounter > 0
      ? paginationCounter.minCounter
      : minPaginationCounter();
  };

  const processPaginationString = () => {
    const dictionaryLabel = `{0}-{1} ${getDictionaryValueOrKey(
      ofLabel
    )} {2} ${getDictionaryValueOrKey(resultsLabel)}`;
    const labelWithResults = dictionaryLabel
      ?.replace('{0}', getPaginationMinCounter())
      ?.replace('{1}', getUpperLimitShownItemsNumber())
      ?.replace('{2}', totalCounter || '');
    const defaultString = `0 ${dictionaryLabel?.split(' ')?.pop()}`;
    return totalCounter ? labelWithResults : defaultString;
  };

  const handleInputChange = (event) => {
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
  };

  const paginationHandlers = {
    goToFirstPage,
    incrementHandler,
    decrementHandler,
    gotToLastPage,
    handleInputChange,
  };
  const paginationStates = {
    pageNumber,
    pageInputRef,
    pageCount,
    totalCounter,
  };

  return {
    paginationStates,
    paginationHandlers,
    processPaginationString,
  };
}

export default useOrderTrackingPaginationState;
