import React, { useState, useEffect } from 'react';
import BaseFlyout from '../BaseFlyout/BaseFlyout';
import { getDictionaryValueOrKey } from '../../../../utils/utils';
import { useOrderTrackingStore } from '../OrdersTrackingGrid/store/OrderTrackingStore';

import CollapsibleSection from './CollapsibleSection';
import useGet from '../../hooks/useGet';
import MessagesForm from './MessagesForm';
import TypesForm from './TypesForm';
import EmailsForm from './EmailsForm';
import CustomSwitch from './CustomSwitch';

const SettingsFlyout = ({
  subheaderReference,
  isTDSynnex = true,
  labels = {},
  config,
}) => {
  const settingsFlyoutConfig = useOrderTrackingStore((st) => st.settingsFlyout);
  const effects = useOrderTrackingStore((st) => st.effects);
  const [isSwitchHovered, setIsSwitchHovered] = useState(false);
  const [isSwitchPressed, setIsSwitchPressed] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  const [apiResponse, isLoading, error] = useGet(
    `${config.uiProactiveServiceDomain}/v1`
  );

  const closeFlyout = () => {
    effects.setCustomState({
      key: 'settingsFlyout',
      value: { data: null, show: false },
    });
  };
  const disabled = false;

  const saveData = () => {
    // TO DO: send data to BE
    closeFlyout();
  };

  const handleSwitchMouseDown = () => {
    setIsSwitchPressed(true);
  };

  const handleSwitchMouseUp = () => {
    setIsSwitchPressed(false);
    setIsSwitchOn(!isSwitchOn);
  };

  const handleSwitchMouseOver = () => {
    setIsSwitchHovered(true);
  };

  const handleSwitchMouseLeave = () => {
    setIsSwitchHovered(false);
  };

  const buttonsSection = (
    <div className="cmp-flyout__footer-buttons settings">
      <button className="secondary" onClick={closeFlyout}>
        {getDictionaryValueOrKey(labels?.cancelSettingsChange)}
      </button>
      <button disabled={false} className="primary" onClick={saveData}>
        {getDictionaryValueOrKey(labels?.save)}
      </button>
    </div>
  );

  const messageOptions = [
    { key: 'InTouch', label: getDictionaryValueOrKey(labels.rangeIntouchOnly) },
    { key: 'All', label: getDictionaryValueOrKey(labels.rangeTdSynnex) },
  ];

  const typeOptions = [
    {
      key: 'TDPACK',
      label: getDictionaryValueOrKey(labels.shippedFromTDSWarehouse),
    },
    { key: 'OFD', label: getDictionaryValueOrKey(labels.outForDelivery) },
    { key: 'DELIVERED', label: getDictionaryValueOrKey(labels.delivered) },
    {
      key: 'EXCEPTION',
      label: getDictionaryValueOrKey(labels.deliveryException),
    },
  ];

  const emailOptions = [
    { key: 'email', label: 'emal@email.com' },
    { key: 'additionalEmail', label: 'additionalEmail@email.com' },
  ];

  const collapsibleSections = [
    {
      title: getDictionaryValueOrKey(labels.notificationMessages),
      content: <MessagesForm options={messageOptions} />,
      expanded: true,
    },
    {
      title: getDictionaryValueOrKey(labels.notificationTypes),
      content: <TypesForm options={typeOptions} />,
      expanded: true,
    },
    {
      title: getDictionaryValueOrKey(labels.notificationEmails),
      content: <EmailsForm options={emailOptions} />,
      expanded: true,
    },
  ];

  return (
    <BaseFlyout
      open={settingsFlyoutConfig?.show}
      onClose={closeFlyout}
      width="465px"
      anchor="right"
      subheaderReference={subheaderReference}
      titleLabel={getDictionaryValueOrKey('Notifications')}
      buttonLabel={getDictionaryValueOrKey('Download selected')}
      secondaryButtonLabel={getDictionaryValueOrKey('Clear all')}
      disabledButton={true}
      secondaryButton={null}
      isTDSynnex={isTDSynnex}
      buttonsSection={buttonsSection}
    >
      <section className="cmp-flyout__content settings">
        <div className="switch-wrapper">
          <p className="switch-label">
            {getDictionaryValueOrKey(labels?.switchLabel)}
          </p>
          <div
            className="switch-icon-wrapper"
            onMouseDown={handleSwitchMouseDown}
            onMouseUp={handleSwitchMouseUp}
            onMouseOver={handleSwitchMouseOver}
            onMouseLeave={handleSwitchMouseLeave}
          >
            <CustomSwitch
              on={isSwitchOn}
              active={isSwitchPressed}
              hovered={isSwitchHovered}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="collapsible-sections-wrapper">
          {collapsibleSections.map((section, index) => (
            <CollapsibleSection
              title={section.title}
              content={section.content}
              expanded={section.expanded}
              key={index}
            />
          ))}
        </div>
      </section>
    </BaseFlyout>
  );
};

export default SettingsFlyout;
