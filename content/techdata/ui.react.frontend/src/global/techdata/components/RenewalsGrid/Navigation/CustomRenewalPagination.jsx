import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from "../../../../../fluentIcons/FluentIcons";
import { TOASTER_LOCAL_STORAGE_KEY } from "../../../../../utils/constants";
import {
  maxCounterCalculator,
  minCounterCalculator,
} from "../../../../../utils/paginationUtil";
import { useMultiFilterSelected } from "../../RenewalFilter/hooks/useFilteringState";
import { updateQueryString } from "../renewalUtils";
import { useRenewalGridState } from "../store/RenewalsStore";

function CustomRenewalPagination({ onQueryChanged }, ref) {
  const isTDSynnex = useRenewalGridState(state => state.isTDSynnex);
  const paginationData = useRenewalGridState((state) => state.pagination);
  const {
    totalCounter,
    currentResultsInPage,
    pageCount,
    pageNumber,
  } = paginationData;

  const gridApi = useRenewalGridState( state => state.gridApi);
  const PAGINATION_LOCAL_STORAGE_KEY = 'paginationLocalStorageData';
  const effects = useRenewalGridState( state => state.effects);
  const { setCustomState, closeAndCleanToaster } = effects;
  const {optionFieldsRef, isFilterDataPopulated} = useMultiFilterSelected();
  const [paginationCounter, setPaginationCounter] = useState({
    minCounter: 0,
    maxCounter: 0,
  });

  const maxPaginationCounter = () =>
  maxCounterCalculator(currentResultsInPage, pageNumber, paginationData);

  const minPaginationCounter = () =>
    minCounterCalculator(currentResultsInPage, pageNumber);

  const updatePaginationCounter = () => {
    setPaginationCounter({
      minCounter: minPaginationCounter(),
      maxCounter: maxPaginationCounter(),
    });   
  };   
  
  const pageInputRef = useRef();

  useEffect(()=>updatePaginationCounter(),[pageNumber]);

  useImperativeHandle(ref, () => ({pageNumber}), [pageNumber])

  if (!gridApi) return null;
  if (!Object.keys(gridApi).length) return null;

  const paginationGetTotalPages = () =>
    pageCount ?? Math.ceil(currentResultsInPage / totalCounter);

  const sendPagingRequest = (queryString = '') => {    
    onQueryChanged();    
  }

  const keepFilteringPayload = (pageNumber) => {
    const postQuery = {
      ...optionFieldsRef.current,
      PageNumber: pageNumber,     
    };
    const queryString = JSON.stringify(postQuery);
    onQueryChanged();
  }

  const incrementHandler = () => {
    if (pageNumber > pageCount - 1) return
    const value = { ...paginationData, pageNumber:pageNumber+1 };
    setCustomState({ key: "pagination", value },  {
      key: PAGINATION_LOCAL_STORAGE_KEY,
      saveToLocal: true,
    });
    updateQueryString(value?.pageNumber);
    if (isFilterDataPopulated.current) {  
      keepFilteringPayload(pageNumber+1)
    } else {    
      sendPagingRequest()
    }
    closeAndCleanToaster();
  };

  const decrementHandler = () => {    
    if (pageNumber-1 <= 0) return
    const value = { ...paginationData, pageNumber:pageNumber-1 };
    setCustomState({ key: "pagination", value }, {
      key: PAGINATION_LOCAL_STORAGE_KEY,
      saveToLocal: true,
    });
    updateQueryString(value?.pageNumber);   
    if (isFilterDataPopulated.current) {  
      keepFilteringPayload(pageNumber-1)
    } else {    
      sendPagingRequest()
    }       
    closeAndCleanToaster();
  };

  const goToSpecificPage = (specificNumber) => {
    const value = { ...paginationData, pageNumber:specificNumber+1};
    setCustomState({ key: "pagination", value }, {
      key: PAGINATION_LOCAL_STORAGE_KEY,
      saveToLocal: true,
    });
    if (isFilterDataPopulated.current) {  
      keepFilteringPayload(specificNumber+1)
    } else {    
      sendPagingRequest()
    }  
  }

  const handleInputBlur = ({ target }) => {
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10))
      return;
    goToSpecificPage(value);    
  };

  const goOnTwoDigits = ({ target }) => {
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10))
      return;
    if (target.value.length >= 3) {
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

  const goToFirstPage = () => goToSpecificPage(0)

  const gotToLastPage = () =>  goToSpecificPage(pageCount-1)

  return (
    <div className="cmp-navigation">
      <div className="navigation__info">
        <span className="cta">
          {paginationCounter.minCounter > 0
            ? paginationCounter.minCounter
            : minPaginationCounter()}
        </span>
        to
        <span className="cta">
          {paginationCounter.maxCounter > 0
            ? paginationCounter.maxCounter
            : maxPaginationCounter()}
        </span>
        of
        <span className="cta">{totalCounter}</span>
        results
      </div>
      <div className="cmp-navigation__actions">
        <button
          disabled={pageNumber === 1}
          onClick={goToFirstPage }
        >
        {isTDSynnex 
          ? <ChevronDoubleLeftIcon/>
          : <i className="fas fa-step-backward"></i>
        }  
           
        </button>
        <button
          className={`move-button${pageNumber === 1 ? "__disabled" : ""}`}
          style={{ cursor: pageNumber !== 1 && "pointer" }}
          disabled={pageNumber === 1}
          onClick={decrementHandler}
        >
        { isTDSynnex 
          ? <ChevronLeftIcon/>
          : <i className="fas fa-chevron-left"></i>
        }
          
        </button>
        <div className="cmp-navigation__actions-labels">
          <input
            className={pageNumber.toString().length > 2 ? 'goSmall' : ''}
            ref={pageInputRef}
            type="number"
            onKeyDown={triggerSearchOnEnter}
            onChange={goOnTwoDigits}
            onBlur={handleInputBlur}
            defaultValue={pageNumber}
            key={Math.random()}
          />
          <span>of</span>
          <span>{pageCount}</span>
        </div>      
        <button
          className={`move-button${
            pageNumber === pageCount ? "__disabled" : ""
          }`}
          disabled={pageNumber === pageCount}
          onClick={incrementHandler}
          style={{ cursor: pageNumber !== pageCount && "pointer" }}
        >
        { isTDSynnex 
          ? <ChevronRightIcon/>
          : <i className="fas fa-chevron-right"></i>
        }
          
        </button>
        <button
          disabled={pageNumber === pageCount}
          onClick={gotToLastPage}
        >
        {isTDSynnex
          ? <ChevronDoubleRightIcon/>
          : <i className="fas fa-step-forward"></i>
        }
        </button>
      </div>
    </div>
  );
}
export default forwardRef( CustomRenewalPagination )
