import React, { useState, useEffect, useRef } from 'react';
import { getDictionaryValue } from '../../../../utils/utils';
import Link from '../Widgets/Link';
import BasicCard from './BasicCard';
import BaseGrid from '../BaseGrid/BaseGrid';
import useExtendGridOperations from '../BaseGrid/Hooks/useExtendGridOperations';
import { useOrderTrackingStore } from '../../components/OrdersTrackingGrid/store/OrderTrackingStore'
import { useMultiFilterSelected } from '../RenewalFilter/hooks/useFilteringState';
//import { fetchData,  setDefaultSearchDateRange } from './utils/orderTrackingUtils';
import { fetchData,  setDefaultSearchDateRange } from '../OrdersTrackingDetail/utils/orderTrackingUtils'


import {
    addCurrentPageNumber,
    getLocalStorageData,
    hasLocalStorageData,
    isFromRenewalDetailsPage,
    mapServiceData,
    setPaginationData,
    updateQueryString,
  } from '../RenewalsGrid/utils/renewalUtils';




function BaseDetail(props) {
    const { optionFieldsRef, isFilterDataPopulated } = useMultiFilterSelected();
    const hasSortChanged = useRef(false);
    const customPaginationRef = useRef();
    const previousFilter = useRef(false);
    const previousSortChanged = useRef(false);
    const firstAPICall = useRef(true);

    const [myData, setMyData] = useState(null);

    //const effects = useOrderTrackingStore((st) => st.effects);
    const { onAfterGridInit, onQueryChanged } = useExtendGridOperations(
      useOrderTrackingStore
    );

  //const componentProp = props.componentProps;
  const gridConfig = {
    ...props.componentProps,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
  };


  const gridApiRef = useRef();  
  
  const _onAfterGridInit = (config) => {
    onAfterGridInit(config);
    gridApiRef.current = config;
  };

  const customRequestInterceptor = async (request) => {
    const queryOperations = {
      hasSortChanged,
      isFilterDataPopulated,
      optionFieldsRef,
      customPaginationRef,
      //componentProp,
      //onSearchAction,
      //searchCriteria,
      previousFilter,
      request,
      previousSortChanged,
      //onFiltersClear,
      firstAPICall,
      //isPriceColumnClicked,
      gridApiRef,
      //reportFilterValue,
    };
    //request.url = addCurrentPageNumber(customPaginationRef, request);
    //const response = await request.get(request.url);
    const response = await fetchData(queryOperations);
    const mappedResponse = mapServiceData(response);
    // const paginationValue = setPaginationData(
    //   mappedResponse?.data?.content,
    //   gridConfig.itemsPerPage
    // );
    // const responseContent = response?.data?.content;
    // const pageNumber = responseContent?.pageNumber;
    // if (responseContent?.pageCount === pageNumber)
    //   gridApi.paginationSetPageSize(responseContent?.items?.length);
    // updateQueryString(pageNumber);
    // setCustomState(
    //   { key: 'pagination', value: paginationValue },
    //   {
    //     key: ORDER_PAGINATION_LOCAL_STORAGE_KEY,
    //     saveToLocal: true,
    //   }
    // );
    setMyData(mappedResponse);
    console.log('response',response)
    return mappedResponse;
  };

  return (
    <div className="cmp-quote-preview cmp-renewal-preview">
      <section>
        <div className="cmp-renewals-qp__config-grid">
          <div className="header-container">
            <div className="image-container">
              <Link variant="back-to-renewal" href={'#'} underline="none">
                <i className="fas fa-chevron-left"></i>
                {getDictionaryValue('details.renewal.label.backToXXX', 'Back')}
              </Link>
              <img className="vendorLogo" src={''} alt="vendor logo" />
            </div>
            <div className="export-container">
              <span className="quote-preview">
                {getDictionaryValue(
                  'details.renewal.label.titleXXX',
                  'Open  |  Order №:   01234597201'
                )}
              </span>
              Actions
              {/* <GridHeader data={data} gridProps={gridProps} /> */}
            </div>
          </div>
          <div className="info-container">
            <BasicCard />
            <BasicCard />
            <BasicCard />
          </div>
        </div>
        <div className="details-container">
          <span className="details-preview">
            Line Item Details
            {/* {componentProp?.productLines?.lineItemDetailsLabel || 'Details'} */}
          </span>
        </div>
        <BaseGrid
          columnList={props.columnList}
          definitions={props.definitions}
          config={gridConfig}
          gridConfig={gridConfig}
          //   defaultSearchDateRange={defaultSearchDateRange}
          requestInterceptor={customRequestInterceptor}
           mapServiceData={mapServiceData}
          //   onSortChanged={onSortChanged}
          onAfterGridInit={_onAfterGridInit}
        />
      </section>
    </div>
  );
}

export default BaseDetail;
