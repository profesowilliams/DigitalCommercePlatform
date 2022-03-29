import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  maxCounterCalculator,
  minCounterCalculator,
  pageCalculator,
} from "../../../../utils/paginationUtil";
import { useMultiFilterSelected } from "../RenewalFilter/hooks/useFilteringState";
import { useRenewalGridState } from "./store/RenewalsStore";

function CustomRenewalPagination({ onQueryChanged }, ref) {
  const paginationData = useRenewalGridState((state) => state.pagination);
  const gridApi = useRenewalGridState((state) => state.gridApi);
  const setPaginationData = useRenewalGridState(
    (state) => state.effects.setCustomState
  );
  const { _generateFilterFields, filterList, dateSelected, datePickerState } =
    useMultiFilterSelected();
  const [paginationCounter, setPaginationCounter] = useState({
    minCounter: 0,
    maxCounter: 0,
  });
  const optionFieldsRef = useRef();
  const isFilterDataPopulated = useRef(false);

  const pageInputRef = useRef();
  const _setOptionsFileds = useCallback(
    ([optionFields, hasData]) => {
      optionFieldsRef.current = optionFields;
      isFilterDataPopulated.current = hasData;
    },
    [filterList, dateSelected]
  );

  useEffect(() => {
    const optionFields = _generateFilterFields();
    optionFields && _setOptionsFileds(optionFields);
    console.log("🚀 ~ optionFields", optionFields);
  }, [filterList, dateSelected, datePickerState]);
  

  const {
    totalCounter,
    stepBy,
    currentPage,
    currentResultsInPage,
    pageCount,
    pageNumber,
  } = paginationData;

  useImperativeHandle(ref, () => ({pageNumber}), [pageNumber])

  if (!gridApi) return null;
  if (!Object.keys(gridApi).length) return null;

  const paginationGetTotalPages = () =>
    pageCount ?? Math.ceil(currentResultsInPage / totalCounter);

  const maxPaginationCounter = () =>
    maxCounterCalculator(currentResultsInPage, pageNumber);

  const minPaginationCounter = () =>
    minCounterCalculator(pageNumber, currentResultsInPage);

  const sendPagingRequest = (queryString = '') => {    
    onQueryChanged({queryString}); 
    updatePaginationCounter();
  }

  const keepFilteringPayload = (pageNumber) => {
    const postQuery = {
      ...optionFieldsRef.current,
      PageNumber: pageNumber,     
    };
    const queryString = JSON.stringify(postQuery);
    onQueryChanged({ queryString }, { filterStrategy: "post" });
  }

  const incrementHandler = () => { 
    if (pageNumber > pageCount - 1) return
    const value = { ...paginationData, pageNumber:pageNumber+1 };
    setPaginationData({ key: "pagination", value });
    if (isFilterDataPopulated.current) {  
      keepFilteringPayload(pageNumber+1)
    } else {    
      sendPagingRequest()
    }    
  };

  const decrementHandler = () => {    
    if (pageNumber-1 <= 0) return
    const value = { ...paginationData, pageNumber:pageNumber-1 };
    setPaginationData({ key: "pagination", value });   
    if (isFilterDataPopulated.current) {  
      keepFilteringPayload(pageNumber-1)
    } else {    
      sendPagingRequest()
    }       
  };
  const goToSpecificPage = (specificNumber) => {
    const value = { ...paginationData, pageNumber:specificNumber+1};
    setPaginationData({ key: "pagination", value });
    if (isFilterDataPopulated.current) {  
      keepFilteringPayload(specificNumber+1)
    } else {    
      sendPagingRequest()
    }  
  }
  const updatePaginationCounter = () => {
    setPaginationCounter({
      minCounter: minPaginationCounter(),
      maxCounter: maxPaginationCounter(),
    });   
  };

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
      updatePaginationCounter();
    }
  };

  const goToFirstPage = () => goToSpecificPage(0)

  const gotToLastPage = () =>  goToSpecificPage(pageCount-1)

  return (
    <div className="cmp-navigation">
      <p className="navigation__info">
        {paginationCounter.minCounter > 0 ? paginationCounter.minCounter : minPaginationCounter()}-{paginationCounter.maxCounter > 0 ? paginationCounter.maxCounter : maxPaginationCounter()} of {totalCounter} results
      </p>
      <p className="cmp-navigation__actions">
        <button className="border"
        disabled={pageNumber === 1}
        onClick={() => {
          goToFirstPage()
          updatePaginationCounter();
        }}>
          <strong>{"|<"}</strong>
          </button>
        <button style={{cursor:pageNumber !== 1 && 'pointer'}} disabled={pageNumber === 1} onClick={decrementHandler}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="cmp-navigation__actions-labels">
          <input
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
          disabled={pageNumber === pageCount}
          onClick={incrementHandler}
          style={{ cursor: pageNumber !== pageCount && "pointer" }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
        <button
          disabled={pageNumber === pageCount}
          className="border" onClick={() => {
            gotToLastPage();
            updatePaginationCounter();
          }}>
            <strong>{">|"}</strong>
        </button>
      </p>
    </div>
  );
}
export default forwardRef( CustomRenewalPagination )
