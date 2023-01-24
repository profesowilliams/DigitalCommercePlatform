import React, {useRef} from 'react';
import { ORDER_PAGINATION_LOCAL_STORAGE_KEY } from '../../../../utils/constants';
import BaseGrid from '../BaseGrid/BaseGrid';
import BaseGridHeader from '../BaseGrid/BaseGridHeader';
import useExtendGridOperations from '../BaseGrid/Hooks/useExtendGridOperations';
import BaseGridPagination from '../BaseGrid/Pagination/BaseGridPagination';
import { addCurrentPageNumber, mapServiceData, setPaginationData, updateQueryString } from '../RenewalsGrid/utils/renewalUtils';
import VerticalSeparator from '../Widgets/VerticalSeparator';
import OrderExport from './Export/OrderExport';
import OrderFilter from './Filter/OrderFilter';
import OpenOrders from './OpenOrders/OpenOrders';
import OrderSearch from './Search/OrderSearch';
import { useOrderTrackingStore } from './store/OrderTrackingStore';
import { ordersTrackingDefinition } from './utils/ordersTrackingDefinitions';
import { setDefaultSearchDateRange } from './utils/orderTrackingUtils';

function OrdersTrackingGrid(props) {
  const customPaginationRef = useRef();
  const effects = useOrderTrackingStore(st => st.effects);
  const { onAfterGridInit, onQueryChanged } = useExtendGridOperations(useOrderTrackingStore);
  const componentProp = JSON.parse(props.componentProp);
  const gridApiRef = useRef();
  const gridConfig = {
    ...componentProp,
    paginationStyle: 'custom',
    noRowsErrorMessage: 'No data found',
    errorGettingDataMessage: 'Internal server error please refresh the page',
  };
  const defaultSearchDateRange = setDefaultSearchDateRange(
    componentProp?.defaultSearchDateRange
  );  
  const {setCustomState} = effects;

  const _onAfterGridInit = (config) => {
    onAfterGridInit(config);
    gridApiRef.current = config;
  }

  const customRequestInterceptor = async (request) => { 
    const gridApi = gridApiRef?.current?.api;
    request.url = addCurrentPageNumber(customPaginationRef, request);
    const response = await request.get(request.url);
    const mappedResponse = mapServiceData(response);
    const paginationValue = setPaginationData(mappedResponse?.data?.content, gridConfig.itemsPerPage);
    const responseContent = response?.data?.content;
    const pageNumber = responseContent?.pageNumber;
    if (responseContent?.pageCount === pageNumber)
      gridApi.paginationSetPageSize(responseContent?.items?.length);
    updateQueryString(pageNumber);
    setCustomState({ key: 'pagination', value: paginationValue }, {
      key: ORDER_PAGINATION_LOCAL_STORAGE_KEY,
      saveToLocal: true,
    })
    return mappedResponse;
  }

  return (
    <div className='cmp-order-tracking-grid'>
      <BaseGridHeader
        leftComponents={[
          <OpenOrders />,
          <VerticalSeparator />,
          <BaseGridPagination
            ref={customPaginationRef}
            store={useOrderTrackingStore}
            onQueryChanged={onQueryChanged}
          />
        ]}
        rightComponents={[
          <OrderSearch /> ,
          <VerticalSeparator />,
          <OrderFilter />,
          <VerticalSeparator />,
          <OrderExport />,
        ]}
      />
      <BaseGrid
        columnList={componentProp.columnList}
        definitions={ordersTrackingDefinition(componentProp)}
        config={gridConfig}
        gridConfig={gridConfig}
        defaultSearchDateRange={defaultSearchDateRange}
        requestInterceptor={customRequestInterceptor}
        onAfterGridInit={_onAfterGridInit}
      />
    </div>
  );
}

export default OrdersTrackingGrid;
