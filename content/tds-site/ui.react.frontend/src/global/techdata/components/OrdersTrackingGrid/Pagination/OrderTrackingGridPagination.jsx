import React, { useState, useRef, useEffect } from 'react';
import Button from '../../Widgets/Button';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '../../../../../fluentIcons/FluentIcons';
import {
  ANALYTIC_CONSTANTS,
  getPaginationAnalyticsGoogle,
  pushDataLayerGoogle
} from '../Utils/analyticsUtils';
import { updateUrl } from './Utils/utils';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';

/**
 * OrderTrackingGridPagination handles the pagination controls for the Order Tracking grid.
 * It allows navigation between pages, updates the URL to reflect the current page,
 * and integrates with Google Analytics to track pagination events.
 * 
 * @param {Object} props - Component properties.
 * @param {Function} props.onPageChange - Callback function invoked when the page changes.
 * @param {boolean} [props.disabled=false] - Flag to disable pagination controls.
 * @param {Object} props.searchParams - Object containing search parameters, including pagination data.
 */
function OrderTrackingGridPagination({
  onPageChange,
  disabled = false,
  searchParams
}) {
  console.log('OrderTrackingGridPagination::init');

  const gridPageSize = 25;  // Number of items per page
  const pageInputRef = useRef();  // Ref for the page number input

  // Retrieve translations from the store
  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Pagination'];

  // States to manage pagination data
  const [totalCounter, setTotalCounter] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [isGoBackDisabled, setIsGoBackDisabled] = useState(false);
  const [isGoForwardDisabled, setIsGoForwardDisabled] = useState(false);

  /**
   * Calculate the total number of pages based on the total number of items
   * and the number of items per page.
   * 
   * @returns {number} - The total number of pages.
   */
  const paginationGetTotalPages = () =>
    pageCount ?? Math.ceil(totalCounter / gridPageSize);

  // Navigate to the first page
  const goToFirstPage = () => goToSpecificPage(0);

  // Navigate to the last page
  const goToLastPage = () => goToSpecificPage(pageCount - 1);

  /**
   * Save the updated pagination data and update the URL.
   * 
   * @param {Object} value - The new pagination data.
   */
  const saveAndUpdatePagination = (value) => {
    console.log('OrderTrackingGridPagination::saveAndUpdatePagination');

    const pagination = {
      pageNumber: value?.pageNumber || 1
    };

    onPageChange(pagination);
    updateUrl(pagination);
  }

  // Increment the page number and update pagination
  const incrementHandler = () => {
    console.log('OrderTrackingGridPagination::incrementHandler');
    if (pageNumber >= pageCount) return;
    const value = { pageNumber: pageNumber + 1 };
    saveAndUpdatePagination(value);
  };

  // Decrement the page number and update pagination
  const decrementHandler = () => {
    console.log('OrderTrackingGridPagination::decrementHandler');
    if (pageNumber <= 1) return;
    const value = { pageNumber: pageNumber - 1 };
    saveAndUpdatePagination(value);
  };

  /**
   * Navigate to a specific page number.
   * 
   * @param {number} specificNumber - The page number to navigate to (0-based index).
   */
  const goToSpecificPage = (specificNumber) => {
    console.log('OrderTrackingGridPagination::goToSpecificPage');
    const value = { pageNumber: specificNumber + 1 };
    saveAndUpdatePagination(value);
  };

  /**
   * Handle blur event for the page number input. Adjusts the page number if it exceeds
   * the total number of pages and updates the page.
   * 
   * @param {Event} event - The blur event.
   */
  const handleInputBlur = ({ target }) => {
    console.log('OrderTrackingGridPagination::handleInputBlur');
    let value = parseInt(target.value, 10) - 1;
    if (parseInt(target.value, 10) > paginationGetTotalPages()) {
      value = paginationGetTotalPages() - 1;
    }
    pushDataLayerGoogle(
      getPaginationAnalyticsGoogle(
        ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageNo,
        value + 1
      )
    );
    goToSpecificPage(value);
  };

  /**
   * Handle input change event for navigating to a specific page when input length is sufficient.
   * 
   * @param {Event} event - The input event.
   */
  const goOnTwoDigits = ({ target }) => {
    console.log('OrderTrackingGridPagination::goOnTwoDigits');
    const value = parseInt(target.value, 10) - 1;
    if (parseInt(target.value, 10) > paginationGetTotalPages()) return;
    if (target.value.length >= 3) {
      pushDataLayerGoogle(
        getPaginationAnalyticsGoogle(
          ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageNo,
          value + 1
        )
      );
      goToSpecificPage(value);
      pageInputRef.current.blur();
    }
  };

  /**
   * Trigger page navigation when the Enter key is pressed.
   * 
   * @param {KeyboardEvent} event - The keydown event.
   */
  const triggerSearchOnEnter = (event) => {
    console.log('OrderTrackingGridPagination::triggerSearchOnEnter');
    const { target } = event;
    const value = parseInt(target.value, 10);
    if (value > paginationGetTotalPages()) return;
    if (event.keyCode === 13) {
      goToSpecificPage(value - 1);
      pageInputRef.current.blur();
    }
  };

  /**
   * Calculate the index of the first item on the current page.
   * 
   * @returns {number} - The index of the first item on the current page.
   */
  const calculateFirstElement = () => {
    return (pageNumber - 1) * gridPageSize + 1;
  };

  /**
   * Calculate the index of the last item on the current page.
   * 
   * @returns {number} - The index of the last item on the current page.
   */
  const calculateLastElement = () => {
    const lastElement = pageNumber * gridPageSize;
    return lastElement > totalCounter ? totalCounter : lastElement;
  };

  /**
   * Handle different types of input change events.
   * 
   * @param {Event} event - The input event.
   */
  const handleInputChange = (event) => {
    console.log('OrderTrackingGridPagination::handleInputChange');
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

  /**
   * Update pagination state when searchParams change.
   * 
   * @param {Object} searchParams - Updated search parameters.
   */
  useEffect(() => {
    console.log('OrderTrackingGridPagination::useEffect');

    if (!searchParams?.paginationAndSorting) return;

    const paginationAndSorting = searchParams.paginationAndSorting;
    setTotalCounter(paginationAndSorting.totalCounter);
    setPageCount(paginationAndSorting.pageCount);
    setPageNumber(paginationAndSorting.pageNumber);
    setIsGoBackDisabled(paginationAndSorting.pageNumber === 1 || disabled);
    setIsGoForwardDisabled(paginationAndSorting.pageNumber === paginationAndSorting.pageCount || disabled);
  }, [searchParams?.paginationAndSorting, disabled]);

  return (
    <>
      {pageNumber > 0 && pageCount > 0 && totalCounter > 0 && (
        <div className="cmp-renewals__pagination--bottom">
          <div className="cmp-navigation">
            <div className="navigation__info">
              {calculateFirstElement()}-{calculateLastElement()} {translations?.Of} {totalCounter || ''} {translations?.Results}
            </div>
            <div className="cmp-navigation__actions">
              <Button
                btnClass={`move-button${isGoBackDisabled ? '__disabled' : ''}`}
                disabled={isGoBackDisabled}
                onClick={goToFirstPage}
                analyticsCallback={getPaginationAnalyticsGoogle.bind(
                  null,
                  ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageBegin,
                  1
                )}
              >
                <ChevronDoubleLeftIcon />
              </Button>
              <Button
                btnClass={`move-button${isGoBackDisabled ? '__disabled' : ''}`}
                disabled={isGoBackDisabled}
                onClick={decrementHandler}
                analyticsCallback={getPaginationAnalyticsGoogle.bind(
                  null,
                  ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageBack,
                  pageNumber - 1
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
                <span>{translations?.Of}</span>
                <span>{pageCount}</span>
              </div>
              <Button
                btnClass={`move-button${isGoForwardDisabled ? '__disabled' : ''}`}
                disabled={isGoForwardDisabled}
                onClick={incrementHandler}
                analyticsCallback={getPaginationAnalyticsGoogle.bind(
                  null,
                  ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageForward,
                  pageNumber + 1
                )}
              >
                <ChevronRightIcon />
              </Button>
              <Button
                btnClass={`move-button${isGoForwardDisabled ? '__disabled' : ''}`}
                disabled={isGoForwardDisabled}
                onClick={goToLastPage}
                analyticsCallback={getPaginationAnalyticsGoogle.bind(
                  null,
                  ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageEnd,
                  pageCount
                )}
              >
                <ChevronDoubleRightIcon />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderTrackingGridPagination;