import React, { useState } from 'react';
import Link from './../Widgets/Link';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import MenuActions from './MenuActions';
import OrderTrackingDetailTitle from './OrderTrackingDetailTitle';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';

const OrderTrackingDetailHeader = ({
  config,
  apiResponse,
  hasAIORights,
  hasOrderModificationRights,
  openFilePdf,
}) => {
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);
  const effects = useOrderTrackingStore((state) => state.effects);
  const { setCustomState } = effects;

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };

  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
  };

  const handleOrderModification = () => {
    setCustomState({
      key: 'orderModificationFlyout',
      value: { data: {}, show: true },
    });
  };

  return (
    <div className="header-container">
      <div className="navigation-container">
        <Link
          variant="back-to-orders"
          href={config?.ordersUrl || '#'}
          underline="underline-none"
        >
          <i className="fas fa-chevron-left"></i>
          {getDictionaryValueOrKey(config?.labels?.detailsBack)}
        </Link>
      </div>
      <div className="title-container">
        {apiResponse?.content && (
          <OrderTrackingDetailTitle
            content={apiResponse.content}
            label={config.labels?.detailsOrderNo}
          />
        )}
        <div
          className="actions-container"
          onMouseOver={handleActionMouseOver}
          onMouseLeave={handleActionMouseLeave}
        >
          <span className="quote-actions">
            {getDictionaryValueOrKey(config.labels?.detailsActions)}
          </span>
          {actionsDropdownVisible && (
            <div
              className="actions-dropdown"
              onMouseOver={handleActionMouseOver}
              onMouseLeave={handleActionMouseLeave}
            >
              <MenuActions
                hasAIORights={hasAIORights}
                hasOrderModificationRights={hasOrderModificationRights}
                content={apiResponse?.content}
                items={apiResponse?.content?.items}
                labels={config?.labels}
                openFilePdf={openFilePdf}
                modifyOrder={handleOrderModification}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OrderTrackingDetailHeader;
