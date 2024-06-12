import React, { useState } from 'react';
import CollapsibleSection from './CollapsibleSection';
import MessagesForm from './MessagesForm';
import TypesForm from './TypesForm';
import EmailsForm from './EmailsForm';
import CustomSwitch from './CustomSwitch';
import { useOrderTrackingStore } from '../../../OrdersTrackingCommon/Store/OrderTrackingStore';

const SettingsContent = ({ labels, settingsData, onChange }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(settingsData.active);
  const userData = useOrderTrackingStore((st) => st.userData);
  const uiTranslations = useOrderTrackingStore(
    (state) => state.uiTranslations
  );
  const translations = uiTranslations?.['OrderTracking.MainGrid.SettingsFlyout'];

  const hasRights = (entitlement) =>
    userData?.roleList?.some((role) => role.entitlement === entitlement);

  const hasResellerAdminRights = hasRights('ResellerAdmin');
  const handleSwitchChange = () => {
    setIsSwitchOn((prevState) => {
      onChange('active', !prevState);
      return !prevState;
    });
  };

  const messageOptions = [
    { key: 'Intouch', label: translations?.Range_IntouchOnly },
    ...(settingsData.rangeAllEnabled
      ? [{ key: 'All', label: translations?.Range_All }]
      : []),
  ];

  const typeOptions = [
    { key: 'TDPACK', label: translations?.Type_ShippedFromWarehouse, },
    { key: 'OFD', label: translations?.Type_OutForDelivery },
    { key: 'DELIVERED', label: translations?.Type_Delivered },
    { key: 'EXCEPTION', label: translations?.Type_DeliveryException, },
  ];

  const emailOptions = [
    { key: 'email', label: settingsData.destination.email },
    ...(hasResellerAdminRights
      ? [
          {
            key: 'additionalEmail',
            label: settingsData.destination.additionalEmail,
          },
        ]
      : []),
  ];

  const {
    emailActive,
    additionalEmailActive,
    destination: { email, additionalEmail },
    range,
    types,
  } = settingsData;

  const collapsibleSections = [
    {
      title: translations?.Sections_NotificationMessages,
      content: (
        <MessagesForm
          value={range}
          onChange={(value) => onChange('range', value)}
          options={messageOptions}
        />
      ),
      expanded: true,
    },
    {
      title: translations?.Sections_NotificationTypes,
      content: (
        <TypesForm
          value={types}
          onChange={(value) => onChange('types', value)}
          options={typeOptions}
        />
      ),
      expanded: true,
    },
    {
      title: translations?.Sections_NotificationEmails,
      content: (
        <EmailsForm
          value={{
            emailActive,
            additionalEmailActive,
            email,
            additionalEmail,
          }}
          isAdditionalEmailEnabled={hasResellerAdminRights}
          options={emailOptions}
          labels={labels}
          onChange={onChange}
        />
      ),
      expanded: true,
    },
  ];

  return (
    <section className="cmp-flyout__content settings">
      <div className="switch-wrapper">
        <p className="switch-label">
          {translations?.Switch_Label}
        </p>
        <div className="switch-icon-wrapper">
          <CustomSwitch checked={isSwitchOn} onChange={handleSwitchChange} />
        </div>
      </div>
      {isSwitchOn && (
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
      )}
    </section>
  );
};

export default SettingsContent;
