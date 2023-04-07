import React, { useState, useEffect, useRef } from 'react';
import { getDictionaryValue } from '../../../../utils/utils';
import Link from '../Widgets/Link';
import SoldToCard from './SoldToCard';
import Grid from '../Grid/Grid';
import useGet from '../../hooks/useGet';
import OrderAcknowledgementCard from './OrderAcknowledgementCard';
import ContactCard from './ContactCard';
import { getDictionaryValueOrKey } from '../../../../utils/utils';

function BaseDetail(props) {
  const [gridData, setGridData] = useState(null);
  const gridConfig = {
    ...props.componentProps,
    serverSide: false,
    paginationStyle: 'none',
  };

  const [apiResponse, isLoading, error] = useGet(
    `${gridConfig.uiServiceEndPoint}?id=123`
  );

  useEffect(() => {
    if (apiResponse) {
      setGridData(apiResponse?.content.items);
    }
  }, [apiResponse]);
  console.log('apiResponse?.content', apiResponse?.content);
  return (
    <div className="cmp-quote-preview cmp-order-preview">
      <section>
        <div className="cmp-orders-qp__config-grid">
          <div className="header-container">
            <div className="image-container">
              <Link variant="back-to-renewal" href={'#'} underline="none">
                <i className="fas fa-chevron-left"></i>
                {getDictionaryValueOrKey(gridConfig.back)}
              </Link>
            </div>
            <div className="export-container">
              <span className="quote-preview">
                {getDictionaryValueOrKey(gridConfig.openNo)}{' '}
                {apiResponse?.content.orderNumber}
              </span>
              <span className="quote-actions">
                {getDictionaryValueOrKey(gridConfig.actions)}
              </span>
              {/* <GridHeader data={data} gridProps={gridProps} /> */}
            </div>
          </div>
          <div className="info-container">
            <SoldToCard
              soldTo={apiResponse?.content?.shipTo || {}}
              config={gridConfig}
            />
            <OrderAcknowledgementCard
              content={apiResponse?.content || {}}
              config={gridConfig}
            />
            <ContactCard
              soldTo={apiResponse?.content?.shipTo || {}}
              config={gridConfig}
            />
          </div>
        </div>
        <div className="cmp-orders-qp__grid">
          <div className="details-container">
            <span className="details-preview">
              Line Item Details
              {/* {componentProp?.productLines?.lineItemDetailsLabel || 'Details'} */}
            </span>
          </div>
          {apiResponse && (
            <Grid
              //onAfterGridInit={onAfterGridInit}
              columnDefinition={props.columnList}
              config={gridConfig}
              data={gridData}
              //getDefaultCopyValue={getDefaultCopyValue}
              //contextMenuItems={contextMenuItems}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default BaseDetail;
