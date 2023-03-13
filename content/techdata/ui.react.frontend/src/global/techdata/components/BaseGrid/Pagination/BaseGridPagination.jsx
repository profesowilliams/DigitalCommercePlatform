import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValue } from '../../../../../utils/utils';
import useBasePaginationState from './useBasePaginationState';

const PAGINATION_LOCAL_STORAGE_KEY = 'paginationLocalStorageData';

function BaseGridPagination({onQueryChanged, store}, ref) {

  const {paginationStates, paginationHandlers, processPaginationString} = useBasePaginationState({store, onQueryChanged});
  const {pageNumber, pageInputRef, pageCount} = paginationStates;
  const {goToFirstPage, incrementHandler, decrementHandler, gotToLastPage, handleInputchange} = paginationHandlers;
   /**
   * The useImperativeHandle hook exposes the paginationData state to external references, 
   * enabling the custom interceptor to make the proper request to the service on changes. 
   */
  useImperativeHandle(ref, () => ({pageNumber}), [pageNumber]);

  return (
    <div className="cmp-navigation">
      <div className="navigation__info">
        {processPaginationString()}
      </div>
      <div className="cmp-navigation__actions">
        <button
          className={`move-button${pageNumber === 1 ? "__disabled" : ""}`}
          disabled={pageNumber === 1}
          onClick={goToFirstPage}
        >
        <ChevronDoubleLeftIcon/>            
        </button>
        <button
          className={`move-button${pageNumber === 1 ? "__disabled" : ""}`}
          disabled={pageNumber === 1}
          onClick={decrementHandler}
        >
        <ChevronLeftIcon/>          
        </button>
        <div className="cmp-navigation__actions-labels">
          <div className="cmp-input-underline">          
            <input
              className={pageNumber.toString().length > 2 ? 'goSmall' : ''}
              ref={pageInputRef}
              type="number"
              onKeyDown={handleInputchange}
              onChange={handleInputchange}
              onBlur={handleInputchange}
              defaultValue={pageNumber}
              key={Math.random()}
            />
          </div>
          <span>{getDictionaryValue("grids.common.label.of", "of")}</span>
          <span>{pageCount}</span>
        </div>      
        <button
          className={`move-button${pageNumber === pageCount ? "__disabled" : ""}`}
          disabled={pageNumber === pageCount}
          onClick={incrementHandler}
        >
       <ChevronRightIcon/>          
        </button>
        <button
          className={`move-button${pageNumber === pageCount ? "__disabled" : ""}`}
          disabled={pageNumber === pageCount}
          onClick={gotToLastPage}
        >
        <ChevronDoubleRightIcon/>
        </button>
      </div>
    </div>
  );
}

export default forwardRef(BaseGridPagination);