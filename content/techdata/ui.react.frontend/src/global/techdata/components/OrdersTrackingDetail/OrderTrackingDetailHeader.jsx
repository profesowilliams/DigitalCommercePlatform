import React, { useState } from 'react';
import Link from './../Widgets/Link';
import { getDictionaryValueOrKey } from './../../../../utils/utils';
import MenuActions from './MenuActions';

const OrderTrackingDetailHeader = ({
  config,
  apiResponse,
  hasAIORights,
  hasOrderModificationRights,
}) => {
  const [actionsDropdownVisible, setActionsDropdownVisible] = useState(false);

  const handleActionMouseOver = () => {
    setActionsDropdownVisible(true);
  };

  const handleActionMouseLeave = () => {
    setActionsDropdownVisible(false);
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
        <div>
          <span className="quote-preview-bold">
            {apiResponse?.content.status}
          </span>
          <span className="quote-preview-bold">
            {apiResponse?.content?.orderNumber &&
              ` | ${getDictionaryValueOrKey(config.labels?.detailsOrderNo)}: `}
          </span>
          <span className="quote-preview">
            {apiResponse?.content?.orderNumber}
          </span>
        </div>
        <div
          className="actions-container"
          onMouseOver={handleActionMouseOver}
          onMouseLeave={handleActionMouseLeave}
        >
          <span className="quote-actions">
            {getDictionaryValueOrKey(config.labels?.actions)}
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
                items={apiResponse?.content?.items}
                labels={config?.labels}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OrderTrackingDetailHeader;
