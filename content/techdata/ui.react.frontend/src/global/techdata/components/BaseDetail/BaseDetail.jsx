import React, { useState, useEffect, useRef } from 'react';
import { getDictionaryValue } from '../../../../utils/utils';
import Link from '../Widgets/Link';
import BasicCard from './BasicCard';
import SoldToCard from './SoldToCard';
import Grid from '../Grid/Grid';
import useGet from '../../hooks/useGet';
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
            <SoldToCard soldTo={apiResponse?.content?.shipTo || {}} />
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
      </section>
    </div>
  );
}

export default BaseDetail;
