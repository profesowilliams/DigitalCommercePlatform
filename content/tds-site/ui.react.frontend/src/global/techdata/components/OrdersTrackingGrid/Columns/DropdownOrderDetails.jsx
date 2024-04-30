import React, { useState, useEffect, useRef } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import {
  TruckIcon,
  TruckActiveIcon,
  DollyIcon,
  DollyActiveIcon,
} from '../../../../../fluentIcons/FluentIcons';
import ShippedTabGrid from './ShippedTabGrid/ShippedTabGrid';
import NotShippedTabGrid from './NotShippedTabGrid/NotShippedTabGrid';
import useGet from '../../../hooks/useGet';
import { LoaderIcon } from '../../../../../fluentIcons/FluentIcons';
import MigrationInfoBox from '../../MigrationInfoBox/MigrationInfoBox';

function DropdownOrderDetails({
  data,
  aemConfig,
  openFilePdf,
  newItem,
  rowsToGrayOutTDNameRef,
  onQueryChanged,
  totalCounter
}) {
  const [apiResponse, isLoading, error] = useGet(
    `${aemConfig.uiCommerceServiceDomain}/v3/order/${data?.id}/lines`,
    'lineDetails'
  );
  const gridRef = useRef();
  const [activeTab, setActiveTab] = useState(0);
  const infoBoxEnable =
    apiResponse?.content?.sapOrderMigration?.referenceType?.length > 0;
  const shippedItemsLeft = apiResponse?.content?.totalShipQuantity;
  const notShippedItemsLeft = apiResponse?.content?.totalOpenQuantity;
  const noShippedItems = shippedItemsLeft === 0;
  const noNotShippedItems = notShippedItemsLeft === 0;
  const partiallyShipped = !noShippedItems && !noNotShippedItems;
  const PONo = data.customerPO;
  const orderNo = data.id;
  const shipCompleted = data.shipComplete;
  const status = data.status !== 'Completed';
  const ordersOrderEditable = data.orderEditable;
  const tabsConfig = [
    {
      index: 0,
      iconActive: (
        <TruckActiveIcon className="order-line-details__header__icon" />
      ),
      iconInActive: <TruckIcon className="order-line-details__header__icon" />,
      label: aemConfig?.orderLineDetails?.shippedLabel,
      numberOfItems: shippedItemsLeft,
      disabledClass: noShippedItems
        ? 'order-line-details__header__disabled'
        : '',
      content: apiResponse?.content ? (
        <ShippedTabGrid
          data={apiResponse?.content?.shipped}
          gridProps={aemConfig}
          openFilePdf={openFilePdf}
          reseller={data?.customerPO}
          id={data?.id}
          totalCounter={totalCounter}
        />
      ) : (
        <LoaderIcon className="loadingIcon-rotate" />
      ),
    },
    {
      index: 1,
      iconActive: (
        <DollyActiveIcon className="order-line-details__header__icon" />
      ),
      iconInActive: <DollyIcon className="order-line-details__header__icon" />,
      label: aemConfig?.orderLineDetails?.notShippedLabel,
      numberOfItems: notShippedItemsLeft,
      disabledClass: noNotShippedItems
        ? 'order-line-details__header__disabled'
        : '',
      content: apiResponse?.content ? (
        <NotShippedTabGrid
          data={apiResponse?.content?.notShipped}
          orderEditable={apiResponse?.content?.orderEditable}
          gridProps={aemConfig}
          PONo={PONo}
          orderNo={orderNo}
          shipCompleted={shipCompleted}
          status={status}
          ordersOrderEditable={ordersOrderEditable}
          activeTab={activeTab}
          gridRef={gridRef}
          rowsToGrayOutTDNameRef={rowsToGrayOutTDNameRef}
          newItem={newItem}
          onQueryChanged={onQueryChanged}
          totalCounter={totalCounter}
        />
      ) : (
        <LoaderIcon className="loadingIcon-rotate" />
      ),
    },
  ];

  const handleTabChange = (tabIndex) => {
    if (!noShippedItems || tabIndex === 1) {
      setActiveTab(tabIndex);
    }
  };

  useEffect(() => {
    if (totalCounter === 1) {
      if (!noShippedItems || partiallyShipped) {
        setActiveTab(0);
      } else if (!noNotShippedItems) {
        setActiveTab(1);
      }
    } else {
      if (shippedItemsLeft === 0) {
        setActiveTab(1);
      } else {
        setActiveTab(0);
      }
    }
  }, [shippedItemsLeft]);

  useEffect(() => {
    error && console.log('Error: ', error);
  }, [error]);

  useEffect(() => {
    if (apiResponse) {
      gridRef.current?.api.setRowData(apiResponse.content?.notShipped);
    }
  }, [apiResponse]);

  return (
    <div className="order-line-details">
      {infoBoxEnable && apiResponse?.content && (
        <MigrationInfoBox
          config={aemConfig?.orderLineDetails}
          id={apiResponse.content.sapOrderMigration?.id}
          referenceType={apiResponse.content.sapOrderMigration?.referenceType}
        />
      )}
      <div className="order-line-details__header">
        {tabsConfig.map((tab) => (
          <div
            key={tab.index}
            className={`order-line-details__header__tab ${
              activeTab === tab.index
                ? 'order-line-details__header__tab-active'
                : 'order-line-details__header__tab-inActive'
            } ${
              (activeTab !== tab.index && noShippedItems) || noNotShippedItems
                ? 'order-line-details__header__tab-disabled'
                : ''
            }`}
            onClick={() => !noNotShippedItems && handleTabChange(tab.index)}
          >
            {activeTab === tab.index ? tab.iconActive : tab.iconInActive}
            <span className={tab.disabledClass}>
              {getDictionaryValueOrKey(tab.label)} {!isLoading && '|'}
            </span>
            {!isLoading && (
              <span className="order-line-details__header__tab-items">
                {tab.numberOfItems}{' '}
                {getDictionaryValueOrKey(
                  aemConfig?.orderLineDetails?.itemsLabel
                )}
              </span>
            )}
          </div>
        ))}
      </div>
      <div>
        {tabsConfig.map((tab) => (
          <div
            style={{ display: `${activeTab === tab.index ? 'block' : 'none'}` }}
            key={tab.index}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropdownOrderDetails;
