import React, { useState } from 'react';
import { getDictionaryValueOrKey } from '../../../../../utils/utils';
import {
  TruckIcon,
  TruckActiveIcon,
  DollyIcon,
  DollyActiveIcon,
} from '../../../../../fluentIcons/FluentIcons';

function DropdownOrderDetails({ data, aemConfig }) {
  const [activeTab, setActiveTab] = useState(0);
  const shippedItemsLeft = '11';
  const notShippedItemsLeft = '22';
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const tabsConfig = [
    {
      index: 0,
      iconActive: (
        <TruckActiveIcon className="order-line-details__header__icon" />
      ),
      iconInActive: <TruckIcon className="order-line-details__header__icon" />,
      label: aemConfig?.orderLineDetails?.shippedLabel,
      numberOfItems: shippedItemsLeft,
      content: <div>Content for Tab 1</div>,
    },
    {
      index: 1,
      iconActive: (
        <DollyActiveIcon className="order-line-details__header__icon" />
      ),
      iconInActive: <DollyIcon className="order-line-details__header__icon" />,
      label: aemConfig?.orderLineDetails?.notShippedLabel,
      numberOfItems: notShippedItemsLeft,
      content: <div>Content for Tab 2</div>,
    },
  ];

  return (
    <div className="order-line-details">
      <div className="order-line-details__header">
        {tabsConfig.map((tab) => (
          <div
            className={`order-line-details__header__tab ${
              activeTab === tab.index
                ? 'order-line-details__header__tab-active'
                : ''
            }`}
            onClick={() => handleTabChange(tab.index)}
          >
            {activeTab === tab.index ? tab.iconActive : tab.iconInActive}
            <span>{getDictionaryValueOrKey(tab.label)} |</span>
            <span className="order-line-details__header__tab-items">
              {tab.numberOfItems}{' '}
              {getDictionaryValueOrKey(aemConfig?.orderLineDetails?.itemsLabel)}
            </span>
          </div>
        ))}
      </div>
      <div>
        {tabsConfig.map((tab) => activeTab === tab.index && tab.content)}
      </div>
    </div>
  );
}

export default DropdownOrderDetails;
