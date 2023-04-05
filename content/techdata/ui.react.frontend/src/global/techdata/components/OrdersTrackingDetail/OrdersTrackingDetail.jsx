import React, { useEffect, useRef, useState } from 'react';
import BaseDetail from '../BaseDetail/BaseDetail';
import { ordersTrackingDefinition } from './utils/ordersTrackingDefinitions';


function OrdersTrackingDetail(props) {
  const componentProps = JSON.parse(props.componentProp);
  //console.log('componentProps',componentProps)
 
  const _onAfterGridInit = (config) => {
    console.log('_onAfterGridInit.......')
    onAfterGridInit(config);
    gridApiRef.current = config;
  };

  return (
    <BaseDetail
      componentProps={componentProps}
      columnList={componentProps.columnList}
      definitions={ordersTrackingDefinition(componentProps)}

      onAfterGridInit={_onAfterGridInit}
    />
  );
}

export default OrdersTrackingDetail;
