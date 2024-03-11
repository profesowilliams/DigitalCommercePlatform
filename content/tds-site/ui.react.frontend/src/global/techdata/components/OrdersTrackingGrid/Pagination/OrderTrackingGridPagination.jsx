import React, { forwardRef, useImperativeHandle } from 'react';
import Button from '../../Widgets/Button';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../../../../fluentIcons/FluentIcons';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import useOrderTrackingPaginationState from './useOrderTrackingPaginationState';
import {
  ANALYTIC_CONSTANTS,
  getPaginationAnalyticsGoogle,
} from '../utils/analyticsUtils';

function OrderTrackingGridPagination(
  {
    onQueryChanged,
    disabled = false,
    paginationAnalyticsLabel,
    paginationLabels,
  },
  ref
) {
  const { resultsLabel, ofLabel } = paginationLabels;
  const {
    paginationStates,
    paginationHandlers,
    processPaginationString,
    analyticsCategory,
  } = useOrderTrackingPaginationState({
    onQueryChanged,
    paginationAnalyticsLabel,
    resultsLabel,
    ofLabel,
  });
  const { pageNumber, pageInputRef, pageCount, totalCounter } =
    paginationStates;
  const {
    goToFirstPage,
    incrementHandler,
    decrementHandler,
    gotToLastPage,
    handleInputChange,
  } = paginationHandlers;
  /**
   * The useImperativeHandle hook exposes the paginationData state to external references,
   * enabling the custom interceptor to make the proper request to the service on changes.
   */

  useImperativeHandle(ref, () => ({ pageNumber }), [pageNumber]);

  const isGoBackDisabled = pageNumber === 1 || disabled;
  const isGoForwardDisabled = pageNumber === pageCount || disabled;

  if (totalCounter === 0) {
    return null;
  }

  return (
    <div className="cmp-renewals__pagination--bottom">
      <div className="cmp-navigation">
        <div className="navigation__info">{processPaginationString()}</div>
        <div className="cmp-navigation__actions">
          <Button
            btnClass={`move-button${isGoBackDisabled ? '__disabled' : ''}`}
            disabled={isGoBackDisabled}
            onClick={goToFirstPage}
            analyticsCallback={getPaginationAnalyticsGoogle.bind(
              paginationAnalyticsLabel,
              analyticsCategory,
              ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageBegin
            )}
          >
            <ChevronDoubleLeftIcon />
          </Button>
          <Button
            btnClass={`move-button${isGoBackDisabled ? '__disabled' : ''}`}
            disabled={isGoBackDisabled}
            onClick={decrementHandler}
            analyticsCallback={getPaginationAnalyticsGoogle.bind(
              paginationAnalyticsLabel,
              analyticsCategory,
              ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageBack
            )}
          >
            <ChevronLeftIcon />
          </Button>
          <div className="cmp-navigation__actions-labels">
            <div className="cmp-input-underline">
              <input
                style={{
                  width: `${pageNumber.toString().length || 1}ch`,
                  minWidth: '40px',
                }}
                className={pageNumber.toString().length > 2 ? 'goSmall' : ''}
                ref={pageInputRef}
                type="number"
                onKeyDown={handleInputChange}
                onChange={handleInputChange}
                onBlur={handleInputChange}
                defaultValue={pageNumber}
                maxLength={5}
                key={Math.random()}
              />
            </div>
            <span>{getDictionaryValueOrKey(ofLabel)}</span>
            <span>{pageCount}</span>
          </div>
          <Button
            btnClass={`move-button${isGoForwardDisabled ? '__disabled' : ''}`}
            disabled={isGoForwardDisabled}
            onClick={incrementHandler}
            analyticsCallback={getPaginationAnalyticsGoogle.bind(
              paginationAnalyticsLabel,
              analyticsCategory,
              ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageForward
            )}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            btnClass={`move-button${isGoForwardDisabled ? '__disabled' : ''}`}
            disabled={isGoForwardDisabled}
            onClick={gotToLastPage}
            analyticsCallback={getPaginationAnalyticsGoogle.bind(
              paginationAnalyticsLabel,
              analyticsCategory,
              ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageEnd
            )}
          >
            <ChevronDoubleRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
export default forwardRef(OrderTrackingGridPagination);
