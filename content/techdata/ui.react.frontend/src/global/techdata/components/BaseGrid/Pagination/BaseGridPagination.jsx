import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import Button from '../../Widgets/Button';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValue } from '../../../../../utils/utils';
import {
  getPaginationAnalytics,
  ANALYTIC_CONSTANTS,
} from '../../Analytics/analytics';
import useBasePaginationState from './useBasePaginationState';

const PAGINATION_LOCAL_STORAGE_KEY = 'paginationLocalStorageData';

function BaseGridPagination({ onQueryChanged, store, disabled = false }, ref) {
  const {
    paginationStates,
    paginationHandlers,
    processPaginationString,
    analyticsCategory,
  } = useBasePaginationState({ store, onQueryChanged });
  const { pageNumber, pageInputRef, pageCount } = paginationStates;
  const {
    goToFirstPage,
    incrementHandler,
    decrementHandler,
    gotToLastPage,
    handleInputchange,
  } = paginationHandlers;
  /**
   * The useImperativeHandle hook exposes the paginationData state to external references,
   * enabling the custom interceptor to make the proper request to the service on changes.
   */
  useImperativeHandle(ref, () => ({ pageNumber }), [pageNumber]);

  const isGoBackDisabled = pageNumber === 1 || disabled;
  const isGoForwardDisabled = pageNumber === pageCount || disabled;

  return (
    <div className="cmp-navigation">
      <div className="navigation__info">{processPaginationString()}</div>
      <div className="cmp-navigation__actions">
        <Button
          btnClass={`move-button${isGoBackDisabled ? '__disabled' : ''}`}
          disabled={isGoBackDisabled}
          onClick={goToFirstPage}
          analyticsCallback={getPaginationAnalytics.bind(
            null,
            analyticsCategory,
            ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageBegin,
            pageNumber
          )}
        >
          <ChevronDoubleLeftIcon />
        </Button>
        <Button
          btnClass={`move-button${isGoBackDisabled ? '__disabled' : ''}`}
          disabled={isGoBackDisabled}
          onClick={decrementHandler}
          analyticsCallback={getPaginationAnalytics.bind(
            null,
            analyticsCategory,
            ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageBack,
            pageNumber
          )}
        >
          <ChevronLeftIcon />
        </Button>
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
          <span>{getDictionaryValue('grids.common.label.of', 'of')}</span>
          <span>{pageCount}</span>
        </div>
        <Button
          btnClass={`move-button${isGoForwardDisabled ? '__disabled' : ''}`}
          disabled={isGoForwardDisabled}
          onClick={incrementHandler}
          analyticsCallback={getPaginationAnalytics.bind(
            null,
            analyticsCategory,
            ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageForward,
            pageNumber
          )}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          btnClass={`move-button${isGoForwardDisabled ? '__disabled' : ''}`}
          disabled={isGoForwardDisabled}
          onClick={gotToLastPage}
          analyticsCallback={getPaginationAnalytics.bind(
            null,
            analyticsCategory,
            ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageEnd,
            pageNumber
          )}
        >
          <ChevronDoubleRightIcon />
        </Button>
      </div>
    </div>
  );
}

export default forwardRef(BaseGridPagination);
