import React, { useState, useRef, useEffect } from 'react';
import Button from '../../Widgets/Button';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon, } from '../../../../../fluentIcons/FluentIcons';
import { ANALYTIC_CONSTANTS, getPaginationAnalyticsGoogle, pushDataLayerGoogle } from '../utils/analyticsUtils';
import { useOrderTrackingStore } from './../../OrdersTrackingCommon/Store/OrderTrackingStore';

function OrderTrackingGridPagination({
  onPageChange,
  disabled = false,
  paginationData
}) {
  console.log('OrderTrackingGridPagination::init');

  if (!paginationData?.totalCounter) {
    return null;
  }

  console.log('OrderTrackingGridPagination::totalCounter => ' + paginationData?.totalCounter);

  const [navigationInfo, setNavigationInfo] = useState(``);

  const { totalCounter, pageCount, pageNumber } = paginationData;
  const gridPageSize = 25;

  const uiTranslations = useOrderTrackingStore((state) => state.uiTranslations);
  const translations = uiTranslations?.['OrderTracking.MainGrid.Pagination'];
  const pageInputRef = useRef();

  const paginationGetTotalPages = () =>
    pageCount ?? Math.ceil(currentResultsInPage / totalCounter);

  const goToFirstPage = () => goToSpecificPage(0);

  const gotToLastPage = () => goToSpecificPage(pageCount - 1);

  const saveAndUpdatePagination = (value) => {
    console.log('OrderTrackingGridPagination::saveAndUpdatePagination');

    const pagination = {
      pageNumber: value?.pageNumber || 1
    };

    onPageChange(pagination);
    setNavigationInfo(processPaginationString());

    updateUrl(pagination);
  }

  const incrementHandler = () => {
    console.log('OrderTrackingGridPagination::incrementHandler');
    if (pageNumber > pageCount - 1) return;
    const value = { ...paginationData, pageNumber: pageNumber + 1 };
    saveAndUpdatePagination(value);
  };

  const decrementHandler = () => {
    console.log('OrderTrackingGridPagination::decrementHandler');
    if (pageNumber - 1 <= 0) return;
    const value = { ...paginationData, pageNumber: pageNumber - 1 };
    saveAndUpdatePagination(value);
  };

  const goToSpecificPage = (specificNumber) => {
    console.log('OrderTrackingGridPagination::goToSpecificPage');
    const value = { ...paginationData, pageNumber: specificNumber + 1 };
    saveAndUpdatePagination(value);
  };

  const handleInputBlur = ({ target }) => {
    console.log('OrderTrackingGridPagination::handleInputBlur');
    let value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10)) {
      value = parseInt(paginationGetTotalPages(), 10) - 1;
    }
    pushDataLayerGoogle(
      getPaginationAnalyticsGoogle(
        ANALYTIC_CONSTANTS.Grid.PaginationEvent.PageNo,
        value + 1
      )
    );
    goToSpecificPage(value);
  };

  const goOnTwoDigits = ({ target }) => {
    console.log('OrderTrackingGridPagination::goOnTwoDigits');
    const value = parseInt(target.value) - 1;
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10))
      return;
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

  const triggerSearchOnEnter = (event) => {
    console.log('OrderTrackingGridPagination::triggerSearchOnEnter');
    const { target } = event;
    const value = parseInt(target.value);
    if (parseInt(target.value) > parseInt(paginationGetTotalPages(), 10))
      return;
    if (event.keyCode === 13) {
      goToSpecificPage(value);
      pageInputRef.current.blur();
    }
  };

  const calculateFirstElement = () => {
    return (pageNumber - 1) * gridPageSize + 1;
  };

  const calculateLastElement = () => {
    const lastElement = pageNumber * gridPageSize;
    return lastElement > totalCounter ? totalCounter : lastElement;
  };

  const processPaginationString = () => {
    console.log('OrderTrackingGridPagination::processPaginationString');
    return `${calculateFirstElement()}-${calculateLastElement()} ${translations?.Of} ${totalCounter || ''} ${translations?.Results}`;
  };

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

  const updateUrl = (pagination) => {
    console.log('OrderTrackingGridPagination::updateUrl');

    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Declare a variable to hold the updated URL
    let url = new URL(window.location.href);

    if (pagination) {
      url.searchParams.set('page', pagination.pageNumber);
    }

    // If the URL has changed, update the browser history
    if (url.toString() !== currentUrl.toString())
      window.history.pushState(null, '', url.toString());
  };

  useEffect(() => {
    setNavigationInfo(processPaginationString());
  }, [paginationData]);


  const isGoBackDisabled = pageNumber === 1 || disabled;
  const isGoForwardDisabled = pageNumber === pageCount || disabled;

  return (
    <div className="cmp-renewals__pagination--bottom">
      <div className="cmp-navigation">
        <div className="navigation__info">{navigationInfo}</div>
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
            onClick={gotToLastPage}
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
  );
}

export default OrderTrackingGridPagination;